package com.hannahenterprises.constructly

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import java.util.UUID

class BuilderDashboardActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth
    private lateinit var db: FirebaseFirestore
    private lateinit var storage: FirebaseStorage

    private lateinit var businessNameEditText: EditText
    private lateinit var descriptionEditText: EditText
    private lateinit var expertiseEditText: EditText
    private lateinit var uploadImageButton: Button
    private lateinit var portfolioImageView: ImageView
    private lateinit var saveProfileButton: Button

    private var selectedImageUri: Uri? = null
    private var uploadedImageUrl: String? = null

    companion object {
        private const val TAG = "BuilderDashboard"
    }

    // ActivityResultLauncher for picking images from gallery
    private val pickImageLauncher: ActivityResultLauncher<Intent> =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == Activity.RESULT_OK && result.data != null) {
                selectedImageUri = result.data?.data
                portfolioImageView.setImageURI(selectedImageUri)
                portfolioImageView.visibility = View.VISIBLE
                // Automatically upload after selection (optional, or on Save button click)
                uploadImageToFirebaseStorage()
            } else {
                Toast.makeText(this, "Image selection cancelled.", Toast.LENGTH_SHORT).show()
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_builder_profile)

        auth = Firebase.auth
        db = Firebase.firestore
        storage = FirebaseStorage.getInstance()

        // Initialize UI elements
        businessNameEditText = findViewById(R.id.businessNameEditText)
        descriptionEditText = findViewById(R.id.descriptionEditText)
        expertiseEditText = findViewById(R.id.expertiseEditText)
        uploadImageButton = findViewById(R.id.uploadImageButton)
        portfolioImageView = findViewById(R.id.portfolioImageView)
        saveProfileButton = findViewById(R.id.saveProfileButton)

        // Set listeners
        uploadImageButton.setOnClickListener { openImageChooser() }
        saveProfileButton.setOnClickListener { saveBuilderProfile() }

        checkIfProfileExists() // Check if builder profile exists on load
    }

    private fun checkIfProfileExists() {
        val currentUser = auth.currentUser
        if (currentUser == null) {
            Log.e(TAG, "User not authenticated in BuilderDashboard.")
            Toast.makeText(this, "Error: User not logged in.", Toast.LENGTH_LONG).show()
            // Optionally redirect to login
            startActivity(Intent(this, MainActivity::class.java))
            finish()
            return
        }

        db.collection("builders").document(currentUser.uid)
            .get()
            .addOnSuccessListener { document ->
                if (document.exists()) {
                    // Profile exists, populate fields and enable editing
                    Log.d(TAG, "Builder profile found for ${currentUser.uid}")
                    businessNameEditText.setText(document.getString("businessName"))
                    descriptionEditText.setText(document.getString("description"))
                    // Expertise is stored as a list, display as comma-separated string
                    val expertiseList = document.get("expertise") as? List<String>
                    expertiseEditText.setText(expertiseList?.joinToString(", "))

                    uploadedImageUrl = document.getString("portfolioImageUrl")
                    if (!uploadedImageUrl.isNullOrEmpty()) {
                        // In a real app, use an image loading library (like Glide or Picasso) here
                        // For simplicity, we'll just show the ImageView.
                        portfolioImageView.visibility = View.VISIBLE
                        Log.d(TAG, "Existing portfolio image URL: $uploadedImageUrl")
                    }
                    saveProfileButton.text = "Update Builder Profile" // Change button text
                    Toast.makeText(this, "Profile loaded for editing.", Toast.LENGTH_SHORT).show()
                } else {
                    Log.d(TAG, "No builder profile found for ${currentUser.uid}. Displaying creation form.")
                    portfolioImageView.visibility = View.GONE // Ensure it's hidden if no image yet
                    saveProfileButton.text = "Create Builder Profile"
                }
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Error checking builder profile: $e")
                Toast.makeText(this, "Error loading profile: ${e.message}", Toast.LENGTH_LONG).show()
                // Default to creation form on error
                portfolioImageView.visibility = View.GONE
                saveProfileButton.text = "Create Builder Profile"
            }
    }

    private fun openImageChooser() {
        val intent = Intent(Intent.ACTION_GET_CONTENT)
        intent.type = "image/*"
        pickImageLauncher.launch(intent)
    }

    private fun uploadImageToFirebaseStorage() {
        selectedImageUri?.let { uri ->
            val currentUser = auth.currentUser ?: return
            val fileName = "portfolio/${currentUser.uid}/${UUID.randomUUID()}" // Unique filename
            val imageRef: StorageReference = storage.reference.child(fileName)

            imageRef.putFile(uri)
                .addOnSuccessListener { taskSnapshot ->
                    taskSnapshot.storage.downloadUrl.addOnSuccessListener { downloadUri ->
                        uploadedImageUrl = downloadUri.toString()
                        Log.d(TAG, "Image uploaded: $uploadedImageUrl")
                        Toast.makeText(this, "Image uploaded successfully!", Toast.LENGTH_SHORT).show()
                    }
                }
                .addOnFailureListener { e ->
                    Log.e(TAG, "Image upload failed: $e")
                    Toast.makeText(this, "Image upload failed: ${e.message}", Toast.LENGTH_LONG).show()
                }
        } ?: Toast.makeText(this, "No image selected.", Toast.LENGTH_SHORT).show()
    }

    private fun saveBuilderProfile() {
        val currentUser = auth.currentUser
        if (currentUser == null) {
            Toast.makeText(this, "Error: User not logged in.", Toast.LENGTH_LONG).show()
            return
        }

        val businessName = businessNameEditText.text.toString().trim()
        val description = descriptionEditText.text.toString().trim()
        val expertiseInput = expertiseEditText.text.toString().trim()
        val expertise = expertiseInput.split(",").map { it.trim() }.filter { it.isNotEmpty() } // Convert to list

        if (businessName.isEmpty() || description.isEmpty() || expertise.isEmpty()) {
            Toast.makeText(this, "Please fill all required fields.", Toast.LENGTH_SHORT).show()
            return
        }

        val builderProfile = hashMapOf(
            "userId" to currentUser.uid,
            "businessName" to businessName,
            "description" to description,
            "expertise" to expertise, // Stored as an array
            "portfolioImageUrl" to (uploadedImageUrl ?: ""), // Store the URL if available
            "lastUpdated" to System.currentTimeMillis()
        )

        db.collection("builders").document(currentUser.uid)
            .set(builderProfile) // Use set() to create or update
            .addOnSuccessListener {
                Log.d(TAG, "Builder profile saved/updated successfully for ${currentUser.uid}")
                Toast.makeText(this, "Builder profile saved!", Toast.LENGTH_SHORT).show()
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Error saving builder profile: $e")
                Toast.makeText(this, "Error saving profile: ${e.message}", Toast.LENGTH_LONG).show()
            }
    }
}