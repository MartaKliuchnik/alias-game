import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import 'bootstrap/dist/css/bootstrap.min.css';
import TeamCard from './TeamCard';
import { leaveRoom } from '../../fetchers/userRoom';

export default function Room({ roomObj, setRoom }) {
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

  const initialTeams = [
    { id: 1, name: 'Team 1', users: [], isFull: false },
    { id: 2, name: 'Team 2', users: [], isFull: false },
    { id: 3, name: 'Team 3', users: [], isFull: false },
  ];

  const [teams, setTeams] = useState(initialTeams);
  const maxUsers = 4;

  // useEffect(() => {
  //   // Function to load teams when the component is mounted
  //   const loadTeams = async () => {
  //     try {
  //       const authToken = cookies.access_token;

  //       if (!authToken) {
  //         console.error('No access token found.');
  //         navigate('/login');
  //         return;
  //       }

  //       const teamIds = [1, 2, 3];

  //       const fetchedTeams = await Promise.all(
  //         teamIds.map((teamId) => getTeam(roomObj._id, teamId, authToken))
  //       );
  //       setTeams(fetchedTeams); // Set the fetched teams to state
  //     } catch (error) {
  //       console.error('Failed to load teams:', error);
  //     }
  //   };

  //   loadTeams(); // Call the function to load teams
  // }, [cookies, roomObj._id, navigate]);

  const addUserToTeam = (teamId, username) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === teamId && team.users.length < maxUsers) {
          return {
            ...team,
            users: [...team.users, username],
            isFull: team.users.length + 1 >= maxUsers,
          };
        }
        return team;
      })
    );
  };

  const removeUserFromTeam = (teamId, username) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === teamId) {
          const updatedUsers = team.users.filter((user) => user !== username);
          return {
            ...team,
            users: updatedUsers,
            isFull: updatedUsers.length >= maxUsers,
          };
        }
        return team;
      })
    );
  };

  const totalUsers = teams.reduce((acc, team) => acc + team.users.length, 0);

  return (
    <div className="container text-black py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Room {roomObj.name}</h3>
        <h3 className="mb-0">Users {totalUsers}/{maxUsers * teams.length}</h3>
        <button className="btn btn-secondary" onClick={handleBackClick}>BACK</button>
      </div>

      <div className="row">
        {teams.map((team) => (
          <div key={team.id} className="col-md-4 mb-4">
            <TeamCard
              team={team}
              onAddUser={addUserToTeam}
              onRemoveUser={removeUserFromTeam}
            />
          </div>
        ))}
      </div>
    </div>
  );
}