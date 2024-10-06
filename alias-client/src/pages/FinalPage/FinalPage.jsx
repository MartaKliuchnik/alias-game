import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTeamsFromRoom } from '../../fetchers/getTeamsFromRoom';
import { getPlayersFromTeam } from '../../fetchers/getPlayersFromTeam';
import Spinner from '../../components/Spinner/Spinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

export default function FinalPage({ teamObj, setTeam, getTokens }) {
	// const access_token = getTokens().access_token;
	const { roomId, _id: teamId } = teamObj;
	const navigate = useNavigate();

	const [players, setPlayers] = useState([]);
	const [loading, setLoading] = useState(true); // To handle loading state
	const [error, setError] = useState(null); // To handle error state

	useEffect(() => {
		const fetchTeamsAndPlayers = async () => {
			try {
				// Fetch all teams in the room
				const teams = await getTeamsFromRoom(roomId);
				setTeam(teams); // Store the fetched teams

				// Fetch players for each team in parallel
				const teamIds = teams.map((team) => team._id);
				const playersData = await Promise.all(
					teamIds.map((teamId) => getPlayersFromTeam(roomId, teamId))
				);

				// Combine all player data
				setPlayers(playersData.flat()); // Store the fetched players
				setLoading(false);
			} catch (err) {
				setError(err.message || 'Failed to retrieve teams and players.');
				setLoading(false); // Ensure to stop loading even on error
			}
		};

		fetchTeamsAndPlayers();
	}, [roomId]);

	// Conditional rendering based on loading, error, and teams state
	if (loading) {
		return <Spinner />;
	}
	if (error) {
		return <ErrorMessage error={error} />;
	}

	return (
		<div className='container my-8'>
			<div className='row justify-content-center mt-5 mb-4'>
				{/* in case that the first team gets the
					hightest result */}
				<h2 className='display-4 text-success text-center'>
					Congratulations, {teams[0].name} has won!
				</h2>
				<div className='text-center'>
					<p className='lead'>
						Well played! Each player has earned 30 points for their excellent
						performance this round.
					</p>
				</div>

				<div className='col-md-7 text-center'>
					<button
						className='btn btn-success btn-lg'
						onClick={() => navigate('/home')}
					>
						Return to Game Room
					</button>
				</div>
			</div>

			<div className='row justify-content-center'>
				{/* Teams leaderboard table */}
				<div className='col-md-6'>
					<h4 className='text-center mb-3'>Team Scores</h4>
					<div className='table-responsive'>
						<table className='table table-bordered table-hover'>
							<thead className='thead-dark'>
								<tr>
									<th className='text-center'>#</th>
									<th className='text-center'>Team</th>
									<th className='text-center'>Score</th>
								</tr>
							</thead>
							<tbody>
								{teams.map((team, index) => (
									<tr key={team._id}>
										<th className='text-center' scope='row'>
											{index + 1}
										</th>
										<td className='text-center'>{team.name}</td>
										<td className='text-center'>{team.teamScore}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Players leaderboard table */}
				<div className='col-md-6'>
					<h4 className='text-center mb-3'>Players' Scores</h4>
					<div className='table-responsive'>
						<table className='table table-bordered table-hover'>
							<thead className='thead-dark'>
								<tr>
									<th className='text-center'>#</th>
									<th className='text-center'>Player</th>
									<th className='text-center'>Score</th>
								</tr>
							</thead>
							<tbody>
								{players.map((player, index) => (
									<tr key={player.userID}>
										<th className='text-center' scope='row'>
											{index + 1}
										</th>
										<td className='text-center'>{player.username}</td>
										<td className='text-center'>{player.score}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
