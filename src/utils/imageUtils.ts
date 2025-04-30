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
 * Returns a hardcoded list of available profile pictures
 * This avoids using Firebase Storage which isn't available in the free plan
 * @returns Promise<string[]> Array of image URLs
 */
export const fetchAvailableProfilePictures = async (): Promise<string[]> => {
  // Define default pictures that should appear first in the list
  const defaultPics = ['/fp/skull.png', '/fp/default.png'];
  
  // Hardcoded list of all profile pictures in the fp directory
  const profilePics = [
    '/fp/Abir_Chakraborty.png',
    '/fp/Agnibha_Chakraborty.png',
    '/fp/Aindrila_Chakraborty.png',
    '/fp/akash das.png',
    '/fp/Aman Kumar Shah.png',
    '/fp/Anik Chakraborti.png',
    '/fp/ANKITA GHOSH.png',
    '/fp/Aranya Adhikary.png',
    '/fp/Aritra Ganguly.png',
    '/fp/Arka Prava De.png',
    '/fp/ARUNIMA KUNDU.png',
    '/fp/ashutosh dubey.png',
    '/fp/Azhan Shadique.png',
    '/fp/Bishal Ghosh.png',
    '/fp/BISWAJIT PATRA.png',
    '/fp/Debika Ray.png',
    '/fp/Dipan Dutta.png',
    '/fp/Dyutiprovo Sarkar.png',
    '/fp/Gitiparna Paul.png',
    '/fp/Ishita Kar.png',
    '/fp/Junaid Islam.png',
    '/fp/Koyena Chakrabarti.png',
    '/fp/KUMAR SAURAV.png',
    '/fp/Manash Das.png',
    '/fp/MD ASAD REYAZ.png',
    '/fp/Md Masoodur Rahman.png',
    '/fp/MEHULI CHATTERJEE.png',
    '/fp/Mousumi Dey.png',
    '/fp/Mriganka Manna.png',
    '/fp/NILABHA MONDAL.png',
    '/fp/Niloy Roy.png',
    '/fp/Poulomi Santra.png',
    '/fp/QUZAL.png',
    '/fp/Raunak Dey.png',
    '/fp/Ritu Prasad.png',
    '/fp/Riya Behera.png',
    '/fp/S Zakya Naseem.png',
    '/fp/Samip Sen.png',
    '/fp/Sampriyo Guin.png',
    '/fp/Sandip Ban.png',
    '/fp/Sandipan Roy.png',
    '/fp/Sankha Sengupta.png',
    '/fp/Sankha Subhra Moitra.png',
    '/fp/Satadipta Dutta.png',
    '/fp/Sayak Hajra.png',
    '/fp/Shambhavi Savarna.png',
    '/fp/Shounak Dey.png',
    '/fp/Shreeja Sarkar.png',
    '/fp/Sk Danish Ali.png',
    '/fp/Sk Mizan Humaid.png',
    '/fp/Sneha Basak.png',
    '/fp/Sneha Singh.png',
    '/fp/Souhit Paul.png',
    '/fp/Soumyadeep Roy.png',
    '/fp/Soumyadeep Samanta.png',
    '/fp/SOUMYAJIT CHAKRABORTY.png',
    '/fp/Souvik Bose.png',
    '/fp/Sreshtha Das.png',
    '/fp/SUBHADIP BAG.png',
    '/fp/Subham Pathak.png',
    '/fp/Subhankar Ray.png',
    '/fp/Subhayan Das.png',
    '/fp/Subhojit Ghosh.png',
    '/fp/Subhon Sanyal.png',
    '/fp/Suchismita Das.png',
    '/fp/Sukanya Manna.png',
    '/fp/Susmita Kumari.png',
    '/fp/Swastika Kayal.png',
    '/fp/Tamojit Ghosh.png',
    '/fp/Tanir Sahoo.png',
    '/fp/Tathagata Das.png',
    '/fp/Titli Saha.png'
  ];
  
  // Return a combined array with default pics first, then all other pics
  return [...defaultPics, ...profilePics];
};