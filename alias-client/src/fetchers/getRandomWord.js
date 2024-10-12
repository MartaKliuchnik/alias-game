export const getRandomWord = async (roomId, teamId, token) => {
  console.log("token: ", token);
  console.log("teamId: ", teamId);
  console.log("roomId: ", roomId);
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/words/random`, {
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
