/**
 * This script generates a manifest file of all profile pictures in the public/fp directory
 * The manifest is used by the application to dynamically load profile pictures
 */
const fs = require('fs');
const path = require('path');

// Directory containing profile pictures
const profilePicsDir = path.join(__dirname, '../public/fp');
// Output manifest file
const manifestFile = path.join(__dirname, '../public/fp/profile-pics-manifest.json');

// Function to read all files in a directory
function getFilesInDirectory(dir) {
  try {
    // Read the directory
    const files = fs.readdirSync(dir);
    
    // Filter out non-image files (assuming profile pics are images)
    const imageFiles = files.filter(file => {
      const extension = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension);
    });
    
    // Format paths as they would be accessed in the browser
    return imageFiles.map(file => `/fp/${file}`);
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

// Generate the manifest
function generateManifest() {
  console.log('Generating profile pictures manifest...');
  
  // Get all image files from the fp directory
  const profilePics = getFilesInDirectory(profilePicsDir);
  
  console.log(`Found ${profilePics.length} profile pictures`);
  
  // Write to manifest file
  fs.writeFileSync(manifestFile, JSON.stringify(profilePics, null, 2));
  
  console.log(`Manifest written to: ${manifestFile}`);
}

// Run the generator
generateManifest();