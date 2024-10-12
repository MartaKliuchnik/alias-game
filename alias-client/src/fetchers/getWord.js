// Function to fetch a word by its ID
const getWord = async (wordId, token) => {
    const url = `${import.meta.env.VITE_SERVER_URL}/api/v1/words/${wordId}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                authorization: token,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch word');
        }

        const data = await response.json();
        return data.word;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to fetch word');
    }
};

export default getWord;
