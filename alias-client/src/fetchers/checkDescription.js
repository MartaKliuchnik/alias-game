export const checkDescription = async (description, wordId) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/words/${wordId}/check-description`, // Using dynamic wordId
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: description, // Sending the description for validation
                }),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to check description');
        }

        const result = await response.json(); // Expecting a boolean value (true/false)
        return result.correct;
    } catch (error) {
        console.error('Error checking description:', error);
        throw error; // Propagate error for handling
    }
};
