
const WIKI_API_URL = 'https://en.wikipedia.org/w/api.php';

/**
 * Fetches a bird image from Wikipedia based on its scientific name.
 * @param {string} scientificName - The scientific name of the bird.
 * @returns {Promise<string|null>} - The URL of the image or null if not found.
 */
export async function getBirdImage(scientificName) {
    try {
        const params = new URLSearchParams({
            action: 'query',
            format: 'json',
            prop: 'pageimages',
            titles: scientificName,
            pithumbsize: 600, // Request a decent size
            origin: '*', // Required for CORS
        });

        const response = await fetch(`${WIKI_API_URL}?${params.toString()}`);
        const data = await response.json();

        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId === '-1' || !pages[pageId].thumbnail) {
            console.warn(`No image found for ${scientificName}`);
            return null;
        }

        return pages[pageId].thumbnail.source;
    } catch (error) {
        console.error('Error fetching bird image:', error);
        return null;
    }
}
