package com.hannahenterprises.constructly

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseAuthException
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.google.firebase.messaging.FirebaseMessaging

class MainActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth
    private lateinit var googleSignInClient: GoogleSignInClient
    private lateinit var googleSignInLauncher: ActivityResultLauncher<Intent>

    // --- Declare ALL UI elements used ---
    private lateinit var emailEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var signInButton: Button // For Email/Password
    private lateinit var googleSignInButton: Button
    private lateinit var signUpTextButton: Button
    private lateinit var forgotPasswordButton: Button

    companion object {
        private const val TAG = "AuthActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        auth = Firebase.auth

        // --- Initialize ALL UI Elements in onCreate ---
        emailEditText = findViewById(R.id.emailEditText)
        passwordEditText = findViewById(R.id.passwordEditText)
        signInButton = findViewById(R.id.signInButton) // Sign In with Email
        googleSignInButton = findViewById(R.id.googleSignInButton)
        signUpTextButton = findViewById(R.id.signUpTextButton)
        forgotPasswordButton = findViewById(R.id.forgotPasswordButton)

        // --- Google Sign In Configuration ---
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()
        googleSignInClient = GoogleSignIn.getClient(this, gso)

        googleSignInLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == Activity.RESULT_OK) {
                val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
                try {
                    val account = task.getResult(ApiException::class.java)!!
                    Log.d(TAG, "firebaseAuthWithGoogle:" + account.id)
                    firebaseAuthWithGoogle(account.idToken!!)
                } catch (e: ApiException) {
                    Log.w(TAG, "Google sign in failed", e)
                    Toast.makeText(baseContext, "Google sign in failed: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            } else {
                Log.w(TAG, "Google sign in cancelled or failed with result code: ${result.resultCode}")
                Toast.makeText(baseContext, "Google Sign-In cancelled.", Toast.LENGTH_SHORT).show()
            }
        }

        // --- UI Listeners ---
        signInButton.setOnClickListener { // Email/Password Sign In
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(baseContext, "Please enter email and password.",
                    Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            auth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(this) { task ->
                    if (task.isSuccessful) {
                        Log.d(TAG, "signInWithEmail:success")
                        val user = auth.currentUser
                        Toast.makeText(baseContext, "Signed in as ${user?.email}", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this, HomeActivity::class.java))
                        finish()
                    } else {
                        Log.w(TAG, "signInWithEmail:failure", task.exception)
                        Toast.makeText(baseContext, "Authentication failed: ${task.exception?.message}",
                            Toast.LENGTH_LONG).show()
                    }
                }
        }

        signUpTextButton.setOnClickListener {
            Log.d(TAG, "Attempting to launch SignUpActivity")
            startActivity(Intent(this, SignUpActivity::class.java))
        }

        googleSignInButton.setOnClickListener {
            signInWithGoogle()
        }

        forgotPasswordButton.setOnClickListener {
            val email = emailEditText.text.toString()
            if (email.isEmpty()) {
                Toast.makeText(baseContext, "Please enter your email to reset password.",
                    Toast.LENGTH_SHORT).show()
            } else {
                sendPasswordReset(email)
            }
        }

        // --- FCM Token Retrieval (for debugging) ---
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (!task.isSuccessful) {
                Log.w(TAG, "Fetching FCM registration token failed", task.exception)
                return@addOnCompleteListener
            }
            val token = task.result
            Log.d(TAG, "The device's FCM Token is: $token")
        }
    } // <<< END OF onCreate METHOD

    // --- Lifecycle Method (MUST be direct member of class) ---
    public override fun onStart() {
        super.onStart()
        val currentUser = auth.currentUser
        if (currentUser != null) {
            startActivity(Intent(this, HomeActivity::class.java))
            finish()
        }
    }

    // --- Google Sign-In Helper Functions (MUST be direct members of class) ---
    private fun signInWithGoogle() {
        val signInIntent = googleSignInClient.signInIntent
        googleSignInLauncher.launch(signInIntent)
    }

    private fun firebaseAuthWithGoogle(idToken: String) {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        auth.signInWithCredential(credential)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    Log.d(TAG, "signInWithCredential success")
                    val user = auth.currentUser
                    Toast.makeText(baseContext, "Signed in with Google as ${user?.email}", Toast.LENGTH_SHORT).show()
                    startActivity(Intent(this, HomeActivity::class.java))
                    finish()
                } else {
                    Log.w(TAG, "signInWithCredential failed", task.exception)
                    Toast.makeText(baseContext, "Authentication failed: ${task.exception?.message}", Toast.LENGTH_SHORT).show()
                }
            }
    }

    // --- Password Reset Helper Function (MUST be direct members of class) ---
    private fun sendPasswordReset(email: String) {
        auth.sendPasswordResetEmail(email)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    Log.d(TAG, "Password reset email sent to $email")
                    Toast.makeText(baseContext, "Password reset email sent to $email.",
                        Toast.LENGTH_LONG).show()
                } else {
                    Log.w(TAG, "sendPasswordReset failed", task.exception)
                    Toast.makeText(baseContext, "Failed to send reset email: ${task.exception?.message}",
                        Toast.LENGTH_LONG).show()
                }
            }
    }
}