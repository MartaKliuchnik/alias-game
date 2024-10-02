import UserCard from './UserCard';

export default function TeamCard({ team, onAddUser, onRemoveUser }) {
  const handleAddUser = () => {
    if (!team.isFull) {
      const username = prompt('Enter new username:');
      if (username) {
        onAddUser(team.id, username);
      }
    }
  };

  return (
    <div className="card bg-dark text-white">
      <div className="card-body">
        <h5 className="card-title">{team.name}</h5>
        <ul className="list-group list-group-flush">
          {team.users.map((user, index) => (
            <UserCard
              key={index}
              index={index}
              username={user}
              teamId={team.id}
              onRemoveUser={onRemoveUser}
            />
          ))}
        </ul>
        <button
          className="btn btn-primary mt-3 w-100"
          onClick={handleAddUser}
          disabled={team.isFull}
        >
          {team.isFull ? 'Full team' : 'Join team'}
        </button>
      </div>
    </div>
  );
}