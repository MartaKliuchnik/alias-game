// import { useCookies } from 'react-cookie';

async function joinTeam(userId, teamId) {
    try {
        // Get the token from cookies
        const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY5MmUzNmNkOGVkM2QwNjBjYzJmOTkiLCJpYXQiOjE3MjgwMjA5NjAsImV4cCI6MTcyODAyNDU2MH0.YKebLzRew4yj_VE7mLIjRC77Pnhrj1_J8v2o1ViaR94";

        const response = await fetch(`http://localhost:8080/api/v1/users/${userId}/team/join/${teamId}`, {
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

async function leaveTeam(userId, teamId) {
    try {
        // Get the token from cookies
        const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY5MmUzNmNkOGVkM2QwNjBjYzJmOTkiLCJpYXQiOjE3MjgwMjA5NjAsImV4cCI6MTcyODAyNDU2MH0.YKebLzRew4yj_VE7mLIjRC77Pnhrj1_J8v2o1ViaR94";

        const response = await fetch(`http://localhost:8080/api/v1/users/${userId}/team/leave/${teamId}`, {
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
