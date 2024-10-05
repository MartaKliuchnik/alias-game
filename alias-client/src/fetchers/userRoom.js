// import { useCookies } from 'react-cookie';

async function joinRoom(userId, authToken) {
    try {
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

async function leaveRoom(userId, roomId, authToken) {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/users/${userId}/room/leave/${roomId}`, {
            method: 'DELETE',
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

export { joinRoom, leaveRoom };
// joinRoom('66f92e36cd8ed3d060cc2f99').then(res => console.log(res)).catch(err => console.error(err));
// leaveRoom('66f92e36cd8ed3d060cc2f99', '66ff7af7a44932697d2e40d9').then(res => console.log(res)).catch(err => console.error(err));