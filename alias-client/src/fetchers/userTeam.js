// import { useCookies } from 'react-cookie';

async function joinTeam(userId, teamId, authToken) {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/users/${userId}/team/join/${teamId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to join team: ${response.statusText}`);
        }

        const team = await response.json();
        return team;
    } catch (error) {
        console.error('Error joining team:', error);
        throw error;
    }
}

async function leaveTeam(userId, teamId, authToken) {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/users/${userId}/team/leave/${teamId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to leave team: ${response.statusText}`);
        }

        const team = await response.json();
        return team;
    } catch (error) {
        console.error('Error leaving team:', error);
        throw error;
    }
}

export { joinTeam, leaveTeam };

// joinTeam('66f92e36cd8ed3d060cc2f99', '66ff7af7a44932697d2e40db').then(res => console.log(res)).catch(err => console.error(err));
// leaveTeam('66f92e36cd8ed3d0e60cc2f99', '66ff7af7a44932697d2e40db').then(res => console.log(res)).catch(err => console.error(err));
