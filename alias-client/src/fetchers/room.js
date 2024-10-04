// import { useCookies } from 'react-cookie';

export async function joinRoom(userId) {
    try {
        // Get the token from cookies
        const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY5MmUzNmNkOGVkM2QwNjBjYzJmOTkiLCJpYXQiOjE3Mjc5NjE2NjQsImV4cCI6MTcyNzk2NTI2NH0.Q6pc4Y3VumJ7zEoa4Fm3Yq3OUVGj2TGWKOrIREM_9t8";

        const response = await fetch(`http://localhost:8080/api/v1/users/${userId}/room/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to join room: ${response.statusText}`);
        }

        const room = await response.json();
        return room;
    } catch (error) {
        console.error('Error joining room:', error);
        throw error;
    }
}

export async function leaveRoom(userId, roomId) {
    try {
        // Get the token from cookies
        const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY5MmUzNmNkOGVkM2QwNjBjYzJmOTkiLCJpYXQiOjE3Mjc5NjE2NjQsImV4cCI6MTcyNzk2NTI2NH0.Q6pc4Y3VumJ7zEoa4Fm3Yq3OUVGj2TGWKOrIREM_9t8";

        const response = await fetch(`http://localhost:8080/api/v1/users/${userId}/room/leave/${roomId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to leave room: ${response.statusText}`);
        }

        const room = await response.json();
        return room;
    } catch (error) {
        console.error('Error leaving room:', error);
        throw error;
    }
}

joinRoom('66f92e36cd8ed3d060cc2f99').then(res => console.log(res)).catch(err => console.error(err));