// fetchers/updateTeamScores.js
const updateTeamScores = async (roomId, token) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/rooms/${roomId}/calculate-scores`,
    {
      method: "PATCH",
      headers: {
        authorization: token, // Добавляем токен для авторизации
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update team scores");
  }

  return response.json();
};

export default updateTeamScores;
