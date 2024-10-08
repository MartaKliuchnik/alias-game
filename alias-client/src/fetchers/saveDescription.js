export const saveDescription = async (roomId, teamId, description) => {
	try {
		const response = await fetch(
			`http://localhost:8080/api/v1/rooms/${roomId}/teams/${teamId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					description: description,
				}),
			}
		);

		if (!response.ok) {
			throw new Error('Failed to submit description');
		}

		const result = await response.json();

		return result;
	} catch (error) {
		console.error('Error submitting description:', error);
		throw error;
	}
};
