/**
 * Fetches team scores for a specific room.
 * @param {string} roomId - The ID of the room to fetch teams for.
 * @param {string} token - The authorization token.
 * @returns {Promise<Array>} - A promise that resolves to an array of teams.
 */
const getTeamScoresInRoom = async (roomId, token) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/rooms/${roomId}/teams`,
    {
      method: 'GET',
      headers: {
        authorization: token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch team scores");
  }

  const teams = await response.json();

  return teams.map((team) => ({
    _id: team._id,
    name: team.name,
    teamScore: team.teamScore,
  }));
};

export default getTeamScoresInRoom;
