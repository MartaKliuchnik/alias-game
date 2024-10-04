export const getRandomWord = async (roomId, teamId, token) => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/words/random", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token, // Send the authorization token
      },
      body: JSON.stringify({ roomId, teamId }), // Send roomId and teamId in the request body
    });

    if (!response.ok) {
      throw new Error("Failed to fetch the word");
    }

    const result = await response.json(); // Expecting { word: { ... }, tryedWords: [...] }
    return result.word; // Return the 'word' object from the response
  } catch (error) {
    console.error("Error fetching the word:", error);
    throw error;
  }
};
