import { useEffect, useRef, useState } from "react";
import Timer from "../../components/Timer/Timer";
import { useNavigate } from "react-router-dom";
import { checkAnswer } from "../../fetchers/checkAnswer";
import { saveAnswer } from "../../fetchers/saveAnswer";
import getSelectedWordId from "../../fetchers/getSelectedWordId";
import calculateScores from "../../fetchers/calculateScores";

// eslint-disable-next-line react/prop-types
export default function LeaderPage({ roomId, teamId }) {
  const [leaderWord, setLeaderWord] = useState("");
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [message, setMessage] = useState("");
  const [wordId, setWordId] = useState(null);
  const wordRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWordId = async () => {
      try {
        const selectedWordId = await getSelectedWordId(roomId, teamId);
        console.log("selectedWordId: ", selectedWordId);
        setWordId(selectedWordId);
      } catch {
        setMessage("Failed to load the word ID. Please try again later.");
      }
    };

    fetchWordId();
  }, [roomId, teamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isTimeUp) {
      console.log(null);
      return;
    }

    if (!leaderWord.trim()) {
      setMessage("You must provide a valid decision before submitting.");
      return;
    }

    if (!wordId) {
      setMessage("Word ID is not available. Please try again later.");
      return;
    }

    try {
      const isCorrect = await checkAnswer(leaderWord, wordId);
      console.log("isCorrect: ", isCorrect);

      const success = await saveAnswer(roomId, teamId, leaderWord, isCorrect);

      if (success) {
        setMessage(
          isCorrect
            ? "Answer is correct and recorded!"
            : "Answer is incorrect but recorded!"
        );
        setLeaderWord("");
        wordRef.current.disabled = true;

        await calculateScores(roomId, teamId);
      } else {
        setMessage("Failed to submit the answer. Please try again later.");
      }
    } catch {
      setMessage("Failed to submit the answer. Please try again later.");
    }
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setLeaderWord("");
    wordRef.current.disabled = true;
  };

  if (isTimeUp) {
    navigate("/teams-result");
  }

  return (
    <div className="container my-5">
      <section
        className="row justify-content-center align-items-center gap-5"
        style={{ marginTop: "8rem" }}
      >
        <div className="col-md-6 text-center">
          <h2 className="mb-4">
            {isTimeUp ? "Time's up!" : "Answer Before Time Runs Out!"}
          </h2>
          <Timer startTime={10} onTimeUp={handleTimeUp} small={false} />
        </div>
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
            <div className="mb-3">
              <label htmlFor="leaderWord" className="form-label">
                Your Final Decision
              </label>
              <input
                type="text"
                id="leaderWord"
                className="form-control form-control-lg"
                ref={wordRef}
                autoComplete="off"
                onChange={(e) => setLeaderWord(e.target.value)}
                value={leaderWord}
                required
                placeholder={
                  isTimeUp
                    ? "Time's up! Can't submit a decision."
                    : "Write your final decision"
                }
                disabled={message !== "" || !wordId}
              />
            </div>
            <button
              className="btn btn-lg btn-success w-100"
              disabled={isTimeUp || message !== "" || !wordId}
            >
              Submit Your Answer
            </button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}{" "}
        </div>
      </section>
    </div>
  );
}