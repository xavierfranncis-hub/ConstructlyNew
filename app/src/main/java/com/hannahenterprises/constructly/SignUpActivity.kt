package com.hannahenterprises.constructly

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase

class SignUpActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth

    companion object {
        private const val TAG = "SignUpActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d(TAG, "SignUpActivity: onCreate started")
        setContentView(R.layout.activity_sign_up)

        auth = Firebase.auth

        val emailEditText = findViewById<EditText>(R.id.emailEditText)
        val passwordEditText = findViewById<EditText>(R.id.passwordEditText)
        val signUpButton = findViewById<Button>(R.id.signUpButton)
        val signInTextButton = findViewById<Button>(R.id.signInTextButton)

        signUpButton.setOnClickListener {
            Log.d(TAG, "Sign Up button clicked")
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(baseContext, "Please enter email and password.",
                    Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            auth.createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener(this) { task ->
                    if (task.isSuccessful) {
                        Log.d(TAG, "User creation successful")
                        val user = auth.currentUser
                        Toast.makeText(baseContext, "Account created for ${user?.email}",
                            Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this, HomeActivity::class.java))
                        finish() // Close SignUpActivity
                    } else {
                        Log.w(TAG, "User creation failed: ${task.exception?.message}")
                        Toast.makeText(baseContext, "Authentication failed: ${task.exception?.message}",
                            Toast.LENGTH_LONG).show()
                    }
                }
        }

        signInTextButton.setOnClickListener {
            Log.d(TAG, "Sign In text button clicked (finishing SignUpActivity)")
            finish() // Closes SignUpActivity, returning to MainActivity
        }
    }
}