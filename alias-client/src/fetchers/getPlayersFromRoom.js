<<<<<<< HEAD
export const getPlayersFromRoom = async (roomId, nestUsers = true) => {
=======
export const getPlayersFromRoom = async (roomId, teamId, token) => {
>>>>>>> pre-prod
	try {
		const response = await fetch(
			`http://localhost:8080/api/v1/rooms/${roomId}/teams?nestUsers=${nestUsers}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
<<<<<<< HEAD
					// authorization: token,
=======
					authorization: token,
>>>>>>> pre-prod
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
