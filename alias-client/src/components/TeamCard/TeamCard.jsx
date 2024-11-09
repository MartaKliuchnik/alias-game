/* eslint-disable react/prop-types */
import UserCard from '../UserCard/UserCard';

export default function TeamCard({ team, isFull, onAddUser, onRemoveUser }) {
	const handleAddUser = () => {
		if (!isFull) {
			onAddUser(team._id);
		}
	};

	return (
		<div className='card bg-dark text-white'>
			<div className='card-body'>
				<h5 className='card-title'>{team.name}</h5>
				<ul className='list-group list-group-flush'>
					{team.players.map((user, index) => (
						<UserCard
							key={index}
							index={index}
							username={user.username}
							teamId={team._id}
							onRemoveUser={onRemoveUser}
						/>
					))}
				</ul>
				<button
					className='btn btn-primary mt-3 w-100'
					onClick={handleAddUser}
					disabled={isFull}
				>
					{isFull ? 'Full team' : 'Join team'}
				</button>
			</div>
		</div>
	);
}
