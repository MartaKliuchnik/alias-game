import { joinRoom, leaveRoom } from "./room.js";
import { joinTeam, leaveTeam } from "./team.js";

(async () => {
    const userId = '66f92e36cd8ed3d060cc2f99';
    const joinedRoom = await joinRoom(userId);
    console.log(joinedRoom);
    const roomId = joinedRoom._id;
    const joinedTeam = await joinTeam(userId, joinedRoom.teams[0]);
    console.log(joinedTeam)
    const leftTeam = await leaveTeam(userId, joinedRoom.teams[0]);
    console.log(leftTeam)
    const leftRoom = await leaveRoom(userId, roomId);
    console.log(leftRoom);
})();