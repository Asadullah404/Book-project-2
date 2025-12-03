/**
 * Search through chapter content
 * @param {string} searchQuery - The search query
 * @returns {Promise<Array>} - Array of search results
 */
export const searchChapters = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
        return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const results = [];

    // Define chapters to search (based on local files)
    const chapters = [
        { id: '09_convolution_and_binaural_sound_synthesis', path: '/content/09_convolution_and_binaural_sound_synthesis.html', title: '09. Convolution and Binaural Sound Synthesis' },
        { id: '10_simulation_methods', path: '/content/10_simulation_methods.html', title: '10. Simulation Methods' },
        { id: '11_simulation_of_sound_in_rooms', path: '/content/11_simulation_of_sound_in_rooms.html', title: '11. Simulation of Sound in Rooms' },
        { id: '18_acoustic_virtual_reality_systems', path: '/content/18_acoustic_virtual_reality_systems.html', title: '18. Acoustic Virtual Reality Systems' }
    ];

    try {
        for (const chapter of chapters) {
            const response = await fetch(chapter.path);
            if (!response.ok) continue;

            const html = await response.text();

            // Parse HTML to extract text and headings
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Search in headings
            const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(heading => {
                const headingText = heading.textContent.trim();
                if (headingText.toLowerCase().includes(query)) {
                    results.push({
                        chapterId: chapter.id,
                        chapterTitle: chapter.title,
                        type: 'heading',
                        heading: headingText,
                        content: headingText,
                        context: ''
                    });
                }
            });

            // Search in paragraphs and other text
            const textNodes = doc.querySelectorAll('p, li, td, div');
            textNodes.forEach(node => {
                const text = node.textContent.trim();
                if (text.toLowerCase().includes(query)) {
                    // Find the closest heading
                    let currentHeading = 'Introduction';
                    let prevElement = node.previousElementSibling;
                    while (prevElement) {
                        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(prevElement.tagName)) {
                            currentHeading = prevElement.textContent.trim();
                            break;
                        }
                        prevElement = prevElement.previousElementSibling;
                    }

                    // Extract context (snippet around the match)
                    const lowerText = text.toLowerCase();
                    const matchIndex = lowerText.indexOf(query);
                    const start = Math.max(0, matchIndex - 50);
                    const end = Math.min(text.length, matchIndex + query.length + 50);
                    let snippet = text.substring(start, end);

                    if (start > 0) snippet = '...' + snippet;
                    if (end < text.length) snippet = snippet + '...';

                    // Avoid duplicates
                    const isDuplicate = results.some(r =>
                        r.chapterId === chapter.id &&
                        r.heading === currentHeading &&
                        r.content === text.substring(0, 100)
                    );

                    if (!isDuplicate && results.length < 50) { // Limit to 50 results
                        results.push({
                            chapterId: chapter.id,
                            chapterTitle: chapter.title,
                            type: 'text',
                            heading: currentHeading,
                            content: snippet,
                            fullText: text,
                            context: snippet
                        });
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error searching chapters:', error);
    }

    return results.slice(0, 50); // Return max 50 results
};
