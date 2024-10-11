import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTeamsFromRoom } from "../../fetchers/getTeamsFromRoom";
import { getPlayersFromRoom } from "../../fetchers/getPlayersFromRoom";
import Spinner from "../../components/Spinner/Spinner";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

// eslint-disable-next-line react/prop-types
export default function FinalPage({ roomId, getTokens }) {
  const access_token = getTokens().access_token;
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error state

  useEffect(() => {
    const fetchTeamsAndPlayers = async () => {
      try {
        // Fetch all teams in the room
        const teams = await getTeamsFromRoom(roomId, access_token);
        setTeams(teams); // Store the fetched teams

        // Fetch players for each team in parallel
        const teamIds = teams.map((team) => team._id);
        const playersData = await Promise.all(
          teamIds.map((teamId) => getPlayersFromRoom(roomId, teamId, access_token))
        );

        // Combine all player data
        setPlayers(playersData.flat()); // Store the fetched players
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to retrieve teams and players.");
        setLoading(false); // Ensure to stop loading even on error
      }
    };

    fetchTeamsAndPlayers();
  }, [roomId]);

  const sortedPlayers = players.slice().sort((a, b) => b.score - a.score);
  const sortedTeams = teams.slice().sort((a, b) => b.teamScore - a.teamScore);

  // Conditional rendering based on loading, error, and teams state
  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="container my-8">
      <div className="row justify-content-center mt-5 mb-4">
        {/* Display the winning team based on score */}
        <h2 className="display-4 text-success text-center">
          Congratulations, {sortedTeams[0].name} has won!
        </h2>
        <div className="text-center">
          <p className="lead">Well played!</p>
        </div>

        <div className="col-md-7 text-center">
          <button
            className="btn btn-success btn-lg"
            onClick={() => navigate("/home")}
          >
            Return to Game Room
          </button>
        </div>
      </div>

      <div className="row justify-content-center">
        {/* Teams leaderboard table */}
        <div className="col-md-6">
          <h4 className="text-center mb-3">Team Scores</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">Team</th>
                  <th className="text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map((team, index) => (
                  <tr key={team._id}>
                    <th className="text-center" scope="row">
                      {index + 1}
                    </th>
                    <td className="text-center">{team.name}</td>
                    <td className="text-center">{team.teamScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Players leaderboard table */}
        <div className="col-md-6">
          <h4 className="text-center mb-3">Players Scores</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">Player</th>
                  <th className="text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, index) => (
                  <tr key={player.userID}>
                    <th className="text-center" scope="row">
                      {index + 1}
                    </th>
                    <td className="text-center">{player.username}</td>
                    <td className="text-center">{player.score}</td>
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
