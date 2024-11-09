export const getLeaderboard = async () => {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_SERVER_URL}/api/v1/leaderboards`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		if (!response.ok) {
			throw new Error('Failed to retrieve the leaderbord');
		}

		const leaderboard = await response.json();

		return leaderboard;
	} catch (error) {
		console.error('Error during retrieving leaderbord:', error);
		throw error;
	}
};
