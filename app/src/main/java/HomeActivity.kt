package com.hannahenterprises.constructly

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase

class HomeActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth
    private lateinit var db: FirebaseFirestore

    companion object {
        private const val TAG = "HomeActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        auth = Firebase.auth
        db = Firebase.firestore

        val clientButton = findViewById<Button>(R.id.clientButton)
        val builderButton = findViewById<Button>(R.id.builderButton)
        val signOutButton = findViewById<Button>(R.id.signOutButton)

        // --- Role Selection Logic ---
        clientButton.setOnClickListener { saveUserRole("client") }
        builderButton.setOnClickListener { saveUserRole("builder") }

        // --- Sign Out Button ---
        signOutButton.setOnClickListener {
            auth.signOut()
            Toast.makeText(this, "Signed out successfully.", Toast.LENGTH_SHORT).show()
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }
    }

    override fun onStart() {
        super.onStart()
        val currentUser = auth.currentUser
        if (currentUser == null) {
            // No user signed in, go back to main login screen
            startActivity(Intent(this, MainActivity::class.java))
            finish()
            return
        }

        // Check if user role is already set in Firestore
        checkUserRole(currentUser.uid)
    }

    private fun checkUserRole(uid: String) {
        db.collection("users").document(uid)
            .get()
            .addOnSuccessListener { document ->
                if (document.exists()) {
                    val role = document.getString("role")
                    if (role != null) {
                        Log.d(TAG, "User role found: $role")
                        // Role already set, navigate to respective dashboard
                        navigateToDashboard(role)
                    } else {
                        Log.d(TAG, "User document exists but no role found. Showing role selection.")
                        // Document exists but no role, show role selection UI (default visibility)
                    }
                } else {
                    Log.d(TAG, "User document does not exist. Show role selection.")
                    // User document doesn't exist, show role selection UI (default visibility)
                }
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Error checking user role: $e")
                Toast.makeText(this, "Error checking role: ${e.message}", Toast.LENGTH_LONG).show()
                // Default to showing role selection UI on error
            }
    }

    private fun saveUserRole(role: String) {
        val currentUser = auth.currentUser ?: return // Should not be null here due to onStart check
        val userRef = db.collection("users").document(currentUser.uid)

        // Data to save: basic user info + selected role
        val userData = hashMapOf(
            "email" to currentUser.email,
            "name" to currentUser.displayName, // Will be null if signed in with just email/password
            "role" to role,
            "createdAt" to System.currentTimeMillis()
        )

        userRef.set(userData) // set() will create the document if it doesn't exist, or overwrite if it does
            .addOnSuccessListener {
                Log.d(TAG, "User role '$role' saved successfully for ${currentUser.uid}")
                Toast.makeText(this, "Role '$role' selected!", Toast.LENGTH_SHORT).show()
                navigateToDashboard(role)
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Error saving user role: $e")
                Toast.makeText(this, "Error saving role: ${e.message}", Toast.LENGTH_LONG).show()
            }
    }

    private fun navigateToDashboard(role: String) {
        val intent = when (role) {
            "client" -> Intent(this, ClientDashboardActivity::class.java)
            "builder" -> Intent(this, BuilderDashboardActivity::class.java)
            else -> {
                Log.w(TAG, "Unknown role: $role, navigating to client dashboard as fallback.")
                Intent(this, ClientDashboardActivity::class.java)
            }
        }
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}