export const getTeamsFromRoom = async (roomId, token) => {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_SERVER_URL}/api/v1/rooms/${roomId}/teams`, // Using dynamic roomId
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					authorization: token,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to retrieve the room's teams");
		}

		const teams = await response.json(); // Expecting an array of team objects
		return teams;
	} catch (error) {
		console.error("Error during retrieving all the room's teams", error);
		throw error;
	}
};
