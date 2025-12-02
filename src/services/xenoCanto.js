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
        // Added 'grp:birds' to ensure we only get birds.
        const query = 'q:A len:10-60 grp:birds';
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
        const genus = randomRecording.gen;
        const species = randomRecording.sp;

        let recordings = [];

        // Optimization: Check if we have enough recordings of this species in the current page
        const sameSpeciesRecordings = pageData.recordings.filter(r => r.gen === genus && r.sp === species);

        if (sameSpeciesRecordings.length >= 3) {
            recordings = sameSpeciesRecordings.slice(0, 3).map(rec => ({
                id: rec.id,
                audio: rec.file,
                location: rec.loc,
                country: rec.cnt,
                type: rec.type
            }));
        } else {
            // Step 4: Fetch up to 3 recordings for this species
            // We keep the quality/length constraints but search specifically for this bird
            const speciesQuery = `gen:${genus} sp:${species} q:A len:10-60 grp:birds`;
            const speciesResponse = await fetch(`${BASE_URL}?query=${encodeURIComponent(speciesQuery)}&key=${apiKey}`);

            if (speciesResponse.ok) {
                const speciesData = await speciesResponse.json();
                recordings = speciesData.recordings.slice(0, 3).map(rec => ({
                    id: rec.id,
                    audio: rec.file,
                    location: rec.loc,
                    country: rec.cnt,
                    type: rec.type
                }));
            } else {
                // Fallback to just the one we found
                recordings = [{
                    id: randomRecording.id,
                    audio: randomRecording.file,
                    location: randomRecording.loc,
                    country: randomRecording.cnt,
                    type: randomRecording.type
                }];
            }
        }

        return {
            id: randomRecording.id,
            name: randomRecording.en, // English name
            sciName: genus + ' ' + species, // Scientific name
            audio: randomRecording.file, // Main audio (fallback)
            recordings: recordings, // Array of recordings
            recordist: randomRecording.rec,
            location: randomRecording.loc,
            country: randomRecording.cnt,
        };

    } catch (error) {
        console.error('Error fetching random bird:', error);
        throw error;
    }
}
