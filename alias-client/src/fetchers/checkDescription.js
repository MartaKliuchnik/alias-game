export const checkDescription = async (description, wordId, token) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/api/v1/words/${wordId}/check-description`, // Using dynamic wordId
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({
          description: description,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to check description");
    }

    const result = await response.json();
    return result.correct;
  } catch (error) {
    console.error("Error checking description:", error);
    throw error;
  }
};
