export const getTeamsFromRoom = async (roomId) => {
	try {
		const response = await fetch(
			`http://localhost:8080/api/v1/rooms/${roomId}/teams`, // Using dynamic roomId
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to retrieve the room's teams");
		}

		const teams = await response.json(); // Expecting an array of team objects
		return teams;
	} catch (error) {
		console.error("Error during retrieving all the room's teams");
		throw error;
	}
};
