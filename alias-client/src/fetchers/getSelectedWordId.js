export default async function getSelectedWordId(roomId, teamId, token) {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_SERVER_URL}/api/v1/rooms/${roomId}/teams/${teamId}`,
			{
				method: 'GET',
				headers: {
					authorization: token,
				},
			}
		);

		if (!response.ok) {
			throw new Error('Failed to fetch team data');
		}

		const team = await response.json();

		return team.selectedWord;
	} catch (error) {
		console.error('Error fetching selected word ID:', error);
		throw error;
	}
}
