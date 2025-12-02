
import { removeBackground } from '@imgly/background-removal';

/**
 * Removes the background from an image URL.
 * @param {string} imageUrl - The URL of the image to process.
 * @returns {Promise<string>} - A blob URL of the image with background removed.
 */
export async function removeImageBackground(imageUrl) {
    try {
        // Configuration for @imgly/background-removal
        // We can configure it to download models from a public CDN if needed,
        // but the default usually works if assets are handled correctly.
        // Note: This might download ~20MB of models on first run.
        const blob = await removeBackground(imageUrl, {
            progress: (key, current, total) => {
                console.log(`Downloading ${key}: ${current} of ${total}`);
            }
        });

        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error removing background:', error);
        throw error;
    }
}
