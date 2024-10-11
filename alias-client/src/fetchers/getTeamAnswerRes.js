const getTeamAnswerRes = async (roomId, teamId, token) => {
  const url = `${import.meta.env.VITE_SERVER_URL}/api/v1/rooms/${roomId}/teams/${teamId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch team results");
    }

    const data = await response.json();
    const { answer, selectedWord, success } = data;
    return { answer, selectedWord, success };
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to fetch team results");
  }
};

export default getTeamAnswerRes;
