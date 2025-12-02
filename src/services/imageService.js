
const WIKI_API_URL = 'https://en.wikipedia.org/w/api.php';

/**
 * Fetches a bird image from Wikipedia based on its scientific name.
 * @param {string} scientificName - The scientific name of the bird.
 * @returns {Promise<string|null>} - The URL of the image or null if not found.
 */
export async function getBirdImage(searchQuery) {
    if (!searchQuery) return null;

    try {
        // First try searching by the provided query (scientific name or common name)
        const params = new URLSearchParams({
            action: 'query',
            format: 'json',
            generator: 'search',
            gsrsearch: searchQuery,
            gsrlimit: 1, // Get top result
            prop: 'pageimages',
            pithumbsize: 600,
            origin: '*',
        });

        const response = await fetch(`${WIKI_API_URL}?${params.toString()}`);
        const data = await response.json();

        if (!data.query || !data.query.pages) {
            console.warn(`No Wikipedia page found for: ${searchQuery}`);
            return null;
        }

        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];

        if (page.thumbnail && page.thumbnail.source) {
            return page.thumbnail.source;
        } else {
            console.warn(`No image found on Wikipedia page for: ${searchQuery}`);
            return null;
        }

    } catch (error) {
        console.error('Error fetching bird image:', error);
        return null;
    }
}
