export const getPlayersFromRoom = async (roomId, teamId) => {
	try {
		const response = await fetch(
			`http://localhost:8080/api/v1/rooms/${roomId}/teams/${teamId}/players`, // Using dynamic roomId and teamId
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to retrieve the team's players");
		}

		const players = await response.json();
		return players;
	} catch (error) {
		console.error('Error during retrieving players from the team:', error);
		throw error;
	}
};
