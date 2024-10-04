import { useNavigate } from 'react-router-dom';
import mockTeams from '../../data/mockTeamsDataFinalPage';

export default function FinalPage() {
	const navigate = useNavigate();

	const testWinningTeam = mockTeams.reduce((prev, current) =>
		current.teamScore > prev.teamScore ? current : prev
	);
	const testAllPlayers = mockTeams.flatMap((team) => team.players);

	return (
		<div className='container my-8'>
			<div className='row justify-content-center mt-5 mb-4'>
				<h2 className='display-4 text-success text-center'>
					Congratulations, {testWinningTeam.name} has won!
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
								{mockTeams.map((team, index) => (
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
								{testAllPlayers.map((player, index) => (
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
