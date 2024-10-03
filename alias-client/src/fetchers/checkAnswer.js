// This function checks if the provided answer is correct by making a POST request to the server.
export const checkAnswer = async (answer, wordId) => {
    try {
        const response = await fetch(
            `http://localhost:8080/api/v1/words/${wordId}/check-answer`, // Dynamic wordId for checking the answer
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer: answer }), // Send the answer in the request body
            }
        );

        if (!response.ok) {
            throw new Error('Failed to check the answer');
        }

        const result = await response.json(); // Expecting { correct: true/false }
        return result.correct; // Return the 'correct' field from the response
    } catch (error) {
        console.error('Error checking answer:', error);
        throw error;
    }
};
