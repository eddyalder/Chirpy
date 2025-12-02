const BASE_URL = 'https://xeno-canto.org/api/3/recordings';

/**
 * Fetches a random bird recording from Xeno-Canto.
 * @param {string} apiKey - The Xeno-Canto API key.
 */
export async function getRandomBird(apiKey) {
    if (!apiKey) {
        throw new Error('API Key is required');
    }

    try {
        // Step 1: Initial broad query
        // We use 'q:A' (quality A) and 'len:10-60' (10 to 60 seconds) to get good, short clips.
        const query = 'q:A len:10-60';
        const initialResponse = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}&key=${apiKey}`);

        if (!initialResponse.ok) {
            const errorData = await initialResponse.json();
            throw new Error(errorData.message || 'Failed to fetch from Xeno-Canto');
        }

        const initialData = await initialResponse.json();

        if (!initialData.numPages) {
            throw new Error('No recordings found');
        }

        const totalPages = initialData.numPages;
        const randomPage = Math.floor(Math.random() * totalPages) + 1;

        // Step 2: Fetch random page
        const pageResponse = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}&page=${randomPage}&key=${apiKey}`);

        if (!pageResponse.ok) {
            const errorData = await pageResponse.json();
            throw new Error(errorData.message || 'Failed to fetch page');
        }

        const pageData = await pageResponse.json();

        if (!pageData.recordings || pageData.recordings.length === 0) {
            throw new Error('No recordings found on page');
        }

        // Step 3: Pick random recording
        const randomRecording = pageData.recordings[Math.floor(Math.random() * pageData.recordings.length)];

        return {
            id: randomRecording.id,
            name: randomRecording.en, // English name
            sciName: randomRecording.gen + ' ' + randomRecording.sp, // Scientific name
            audio: randomRecording.file,
            recordist: randomRecording.rec,
            location: randomRecording.loc,
            country: randomRecording.cnt,
        };

    } catch (error) {
        console.error('Error fetching random bird:', error);
        throw error;
    }
}
