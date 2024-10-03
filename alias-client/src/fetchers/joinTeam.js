// import { useCookies } from 'react-cookie';

export async function joinTeam(userId, teamId) {
    try {
        // Get the token from cookies
        const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY5MmUzNmNkOGVkM2QwNjBjYzJmOTkiLCJpYXQiOjE3Mjc5NjE2NjQsImV4cCI6MTcyNzk2NTI2NH0.Q6pc4Y3VumJ7zEoa4Fm3Yq3OUVGj2TGWKOrIREM_9t8";

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

joinTeam('66f92e36cd8ed3d060cc2f99', '66fe9b4cdb4275ef20f39e8a').then(res => console.log(res)).catch(err => console.error(err));
