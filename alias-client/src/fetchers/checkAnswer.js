// This function checks if the provided answer is correct by making a POST request to the server.
export const checkAnswer = async (answer, wordId, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/words/${wordId}/check-answer`, // Dynamic wordId for checking the answer
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ answer }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to check the answer");
    }

    const result = await response.json(); // { correct: true/false }

    return result.correct;
  } catch (error) {
    console.error("Error checking answer:", error);
    throw error;
  }
};
