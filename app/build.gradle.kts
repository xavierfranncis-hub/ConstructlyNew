// app/build.gradle.kts content

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.gms.google-services") // This will be added by Firebase Assistant
}

android {
    namespace = "com.hannahenterprises.constructly" // This should be here
    compileSdk = 34 // Or latest stable version

    defaultConfig {
        applicationId = "com.hannahenterprises.constructly"
        minSdk = 21 // Or what you chose
        targetSdk = 34 // Or latest stable version
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {
    // Core Kotlin and AndroidX libraries
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.activity:activity-ktx:1.8.2") // For ActivityResultLauncher

    // Testing libraries
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")

    // Firebase BoM (Bill of Materials) - Ensures compatible versions
    implementation(platform("com.google.firebase:firebase-bom:32.7.0")) // Use 32.7.0 or newer

    // Firebase Products (added by Firebase Assistant and manually verified)
    implementation("com.google.firebase:firebase-auth-ktx") // Auth
    implementation("com.google.android.gms:play-services-auth:21.0.0") // Google Sign-In support
    implementation("com.google.firebase:firebase-firestore-ktx") // Firestore
    implementation("com.google.firebase:firebase-storage-ktx") // Cloud Storage
    implementation("com.google.firebase:firebase-messaging-ktx") // Cloud Messaging

}