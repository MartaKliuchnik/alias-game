import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import TeamCard from './TeamCard';

export default function Room({ name }) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/home');
  };

  const initialTeams = [
    { id: 1, name: 'Team 1', users: [], isFull: false },
    { id: 2, name: 'Team 2', users: [], isFull: false },
    { id: 3, name: 'Team 3', users: [], isFull: false },
  ];

  const [teams, setTeams] = useState(initialTeams);
  const maxUsers = 4;

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
        <h3 className="mb-0">Room {name}</h3>
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