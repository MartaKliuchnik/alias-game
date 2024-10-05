import { useState, useEffect } from "react";
import fetchTeamResult from "../../fetchers/fetchTeamResult";
import fetchWord from "../../fetchers/fetchWord";
import mockTeams from "../../data/mockTeams";

export default function TeamsResultPage() {
  const [teamResult, setTeamResult] = useState(null);
  const [fetchedWord, setFetchedWord] = useState("");
  const [error, setError] = useState("");

  const roomId = "67013095bf8e9f7326e013f7"; // Test roomId
  const teamId = "67013149420fd1486ca018e1"; // Test teamId


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchTeamResult(roomId, teamId);
        setTeamResult(result); // Store the result in state

        // Fetch the word using the selectedWord ID from teamResult
        const word = await fetchWord(result.selectedWord);
        setFetchedWord(word); // Store the fetched word in state
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [roomId, teamId]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!teamResult) {
    return <div>Loading...</div>;
  }

  const { answer, success } = teamResult;

  return (
    <div className="container my-8">
      <div
        className="row justify-content-center align-items-stretch gap-5"
        style={{ marginTop: "8rem" }}
      >
        {/* Section for showing the table with updated scores for teams */}
        <div className="col-lg-5 col-md-6 d-flex">
          <div className="card shadow d-flex h-100">
            <div className="card-body">
              <h2 className="text-center mb-4">Team Leaderboard</h2>
              {success ? (
                <p className="text-success text-center">
                  Congratulations! Each player has earned +10 points for
                  providing the correct word.
                </p>
              ) : (
                <p className="text-danger text-center">
                  Oops! The word you provided was incorrect. Unfortunately, your
                  team won’t earn any points this round.
                </p>
              )}
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col" className="text-center">
                        #
                      </th>
                      <th scope="col" className="text-center">
                        Team
                      </th>
                      <th scope="col" className="text-center">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTeams.map((team, index) => (
                      <tr key={team._id}>
                        <th scope="row" className="text-center">
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
          </div>
        </div>

        {/* Section for showing the team's result in this round */}
        <div className="col-lg-5 col-md-6 d-flex">
          <div className="card shadow h-100 w-100">
            <div className="card-body text-center">
              <h2 className="mb-5">Team performance</h2>
              {success ? (
                <div>
                  <div className="alert alert-success">
                    <p>
                      <strong>Correct Answer:</strong> {fetchedWord} {/* Use the fetched word here */}
                    </p>
                    <p>
                      <strong>Your Answer:</strong> {answer}
                    </p>
                  </div>
                  <p className="mt-4 text-center">You all did amazing!</p>
                  <p className="text-center">
                    Let’s keep this energy going into the next round!
                  </p>
                </div>
              ) : (
                <div>
                  <div className="alert alert-danger">
                    <p>
                      <strong>Your Answer:</strong> {answer}
                    </p>
                    <p>
                      The correct word was: <strong>{fetchedWord}</strong> {/* Use the fetched word here */}
                    </p>
                  </div>
                  <p className="mt-4 text-center">Better luck next time!</p>
                  <p className="text-center">
                    Every round is a chance to improve. Let&apos;s keep
                    learning!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
