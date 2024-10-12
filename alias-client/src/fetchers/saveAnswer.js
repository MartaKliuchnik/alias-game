export const saveAnswer = async (roomId, teamId, answer, success, token) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/rooms/${roomId}/teams/${teamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: token,
            },
            body: JSON.stringify({
                answer,
                success,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save the answer');
        }

        return true;
    } catch (error) {
        console.error('Error saving answer:', error);
        return false;
    }
};
