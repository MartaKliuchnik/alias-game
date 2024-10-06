import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { getPlayersFromTeam } from '../../fetchers/getPlayersFromTeam';
import Timer from '../Timer/Timer.jsx';
import { getTeam } from '../../fetchers/getTeam.js';

// UserCard Component
const UserCard = ({ username }) => (
	<li className='list-group-item bg-dark text-white'>{username}</li>
);

// TeamList Component
const TeamList = ({ teamName, players = [] }) => (
	<div>
		<h5 className='text-white'>Team: {teamName}</h5>
		<ul className='list-group'>
			{players?.map((player, index) => (
				<UserCard key={index} username={player.username} />
			))}
		</ul>
	</div>
);

// Main Wait Component
export default function Wait({ teamObj, waitTime, setTeam, role }) {
	const [isTimeUp, setIsTimeUp] = useState(false);
	const { roomId, _id: teamId, name: teamName } = teamObj;
	const [teamPlayersInfo, setTeamPlayersInfo] = useState([]); // 3 players with their info
	const navigate = useNavigate();

	useEffect(() => {
		const fetchTeamData = async () => {
			try {
				// Fetch latest team details
				const latestTeam = await getTeam(roomId, teamId);
				setTeam(latestTeam);

				// Fetch players info for the team
				const players = await getPlayersFromTeam(roomId, teamId);
				setTeamPlayersInfo(players);
			} catch (error) {
				console.error('Error fetching team or players:', error);
			}
		};

		// Fetch data only when roomId and teamId are available
		if (roomId && teamId) {
			fetchTeamData();
		}
	}, [roomId, teamId, setTeam]);

	const handleTimeOut = () => {
		setIsTimeUp(true);
	};

	// Redirect after time is up
	useEffect(() => {
		if (isTimeUp) {
			role === 'describer write description'
				? navigate('/discussion')
				: navigate('/teams-result');
		}
	}, [isTimeUp, navigate]);

	return (
		<div className='container py-5'>
			<div className='row'>
				{/* Left column: Timer and Team List */}
				<div className='col-md-3'>
					{/* Timer */}
					<div className='mb-4 bg-dark p-3 rounded'>
						<Timer
							startTime={waitTime}
							onTimeOut={handleTimeOut}
							small={true}
						/>
					</div>
					{/* Team List */}
					<div className='bg-dark p-3 rounded'>
						<TeamList teamName={teamName} players={teamPlayersInfo} />
					</div>
				</div>

				{/* Right column: Wait Message */}
				<div className='col-md-9 d-flex flex-column'>
					{/* Wait Message */}
					<div
						className='bg-secondary rounded d-flex justify-content-center align-items-center flex-grow-1'
						style={{ minHeight: '250px' }}
					>
						<h6 className='text-white mb-0'>{`Wait ${waitTime} sec until ${role}`}</h6>
					</div>
				</div>
			</div>
		</div>
	);
}
