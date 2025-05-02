/**
 * Utility function to safely encode image URLs with spaces in filenames
 * This solves the issue of images not loading when they have spaces in their names
 */
export const encodeImageUrl = (url: string): string => {
  if (!url) return '';
  
  // If the URL already has protocol (http/https), don't modify it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // For local URLs, split by directory separator and encode each segment
  const segments = url.split('/');
  
  // Only encode the filename (last segment)
  const lastIndex = segments.length - 1;
  
  // Encode only the last part (filename) because that's where the spaces usually are
  segments[lastIndex] = encodeURIComponent(segments[lastIndex]);
  
  return segments.join('/');
};

/**
 * Returns a list of available profile pictures
 * Instead of hardcoded paths, this uses a dynamic approach to load all images from the fp directory
 * @returns Promise<string[]> Array of image URLs
 */
export const fetchAvailableProfilePictures = async (): Promise<string[]> => {
  try {
    // Define default pictures that should appear first in the list
    const defaultPics = ['/fp/default.png'];
    
    // Fetch the directory listing using a manifest file
    const response = await fetch('/fp/profile-pics-manifest.json');
    
    if (!response.ok) {
      console.error('Failed to load profile pictures manifest');
      return defaultPics;
    }
    
    const profilePics: string[] = await response.json();
    
    // Make sure all paths are properly formatted with leading slash if needed
    const formattedPics = profilePics.map(path => {
      // Ensure consistent format with leading slash
      return path.startsWith('/') ? path : `/${path}`;
    });
    
    // Return a combined array with default pics first, then all other pics
    // Remove duplicates using Array.from instead of spread with Set for better compatibility
    const uniquePics = Array.from(new Set([...defaultPics, ...formattedPics]));
    return uniquePics;
  } catch (error) {
    console.error('Error loading profile pictures:', error);
    // Fallback to at least return the default pic
    return ['/fp/default.png'];
  }
};