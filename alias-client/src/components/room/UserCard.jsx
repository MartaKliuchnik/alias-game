export default function UserCard({ index, username, teamId, onRemoveUser }) {
  const handleRemoveUser = () => {
    onRemoveUser(teamId, username);
  };

  return (
    <li
      className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center"
      onClick={handleRemoveUser}
      style={{ cursor: 'pointer' }}
    >
      {index + 1}. {username}
      <span className="badge bg-danger">Remove</span>
    </li>
  );
}