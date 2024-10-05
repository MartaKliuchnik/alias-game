import { useRef, useState } from "react";
import { Timer } from "../../components/Timer/Timer";
import { useNavigate } from "react-router-dom";
import { checkAnswer } from "../../fetchers/checkAnswer";
import { saveAnswer } from "../../fetchers/saveAnswer";

export default function LeaderPage() {
  const [leaderWord, setLeaderWord] = useState("");
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [message, setMessage] = useState("");
  const wordRef = useRef();
  const navigate = useNavigate();
  const wordId = "66fbe2fec4dcc97328d2ed48"; // test wordId !!!
  const roomId = "67013095bf8e9f7326e013f7"; // test roomId !!!
  const teamId = "67013149420fd1486ca018e1"; // test teamId !!!

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isTimeUp) {
      console.log(null); // Time has run out
      return;
    }

    if (!leaderWord.trim()) {
      setMessage("You must provide a valid decision before submitting.");
      return;
    }

    try {
      const isCorrect = await checkAnswer(leaderWord, wordId);
	  console.log('isCorrect: ', isCorrect);

      const success = await saveAnswer(roomId, teamId, leaderWord, isCorrect);

      if (success) {
        setMessage(
          isCorrect
            ? "Answer is correct and recorded!"
            : "Answer is incorrect but recorded!"
        );
        setLeaderWord("");
        wordRef.current.disabled = true;
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
          <Timer initialCount={10} onTimeUp={handleTimeUp} />
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
                disabled={message !== ""}
              />
            </div>
            <button
              className="btn btn-lg btn-success w-100"
              disabled={isTimeUp || message !== ""}
            >
              Submit Your Answer
            </button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}{" "}
          {}
        </div>
      </section>
    </div>
  );
}
