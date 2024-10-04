import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import 'bootstrap/dist/css/bootstrap.min.css';
import TeamCard from './TeamCard';
import { leaveRoom } from '../../fetchers/userRoom';
import { getTeamsFromRoom } from '../../fetchers/getTeamsFromRoom';
import { getPlayersFromRoom } from '../../fetchers/getPlayersFromRoom';
import { joinTeam, leaveTeam } from '../../fetchers/userTeam';

export default function Room({ roomObj, setRoom, setTeam, getIdFromToken }) {
  const navigate = useNavigate();
  const [cookies] = useCookies(['access_token']);

  const handleBackClick = async () => {
    const accessToken = cookies.access_token;
    if (!accessToken) {
      console.error('No access token found.');
      return;
    }

    const tokenParts = accessToken.split('.');
    if (tokenParts.length !== 3) {
      console.error('Invalid token format.');
      return;
    }

    const base64Payload = tokenParts[1];
    const payload = JSON.parse(atob(base64Payload));

    const userId = payload.userId;
    if (!userId) {
      console.error('No userId found in token.');
      return;
    }
    await leaveRoom(userId, roomObj._id, accessToken);
    setRoom({});
    navigate('/home');
  };

  const maxUsers = 4;
  const [teams, setTeams] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadTeams = async () => {
    try {
      const authToken = cookies.access_token;

      if (!authToken) {
        console.error('No access token found.');
        navigate('/login');
        return;
      }

      let fetchedTeams = await getTeamsFromRoom(roomObj._id);
      fetchedTeams = await Promise.all(fetchedTeams.map(
        async team => {
          const players = await getPlayersFromRoom(team.roomId, team._id)
          team.players = players;
          return team;
        }))
      setTeams(fetchedTeams);
    } catch (error) {
      console.error('Failed to load teams:', error);
    }
  };

  useEffect(() => {
    loadTeams();
    const intervalId = setInterval(() => {
      loadTeams();
    }, 2000);
    return () => clearInterval(intervalId);
  }, [cookies, roomObj._id, navigate]);

  const addUserToTeam = (teamId) => {
    const userId = getIdFromToken();
    teams.forEach(async (team) => {
      if (team._id === teamId && team.players.length < maxUsers) {
        const teamToJoin = await joinTeam(userId, teamId, cookies.access_token);
        console.log(teamToJoin);
        setTeam(teamToJoin);
      }
      return team;
    })
  };

  const removeUserFromTeam = (teamId) => {
    const userId = getIdFromToken();
    teams.forEach(async (team) => {
      if (team._id === teamId) {
        await leaveTeam(userId, teamId, cookies.access_token);
        setTeam({});
      }
      return team;
    })
  };

  const totalUsers = teams.reduce((acc, team) => acc + team.players.length, 0);

  return (
    <div className="container text-black py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Room {roomObj.name}</h3>
        <h3 className="mb-0">Users {totalUsers}/{maxUsers * teams.length}</h3>
        <button className="btn btn-secondary" onClick={handleBackClick}>BACK</button>
      </div>

      {/* <div className="row"> */}
      {teams.map((team) => (
        <div key={team.id} className="col-md-4 mb-4">
          <TeamCard
            team={team}
            isFull={team.players.length >= maxUsers}
            onAddUser={addUserToTeam}
            onRemoveUser={removeUserFromTeam}
          />
        </div>
      ))}
      {/* </div> */}
    </div>
  );
}