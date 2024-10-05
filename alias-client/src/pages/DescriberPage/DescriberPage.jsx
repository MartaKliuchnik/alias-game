import { useState, useEffect } from "react";
import { Timer } from "../../components/Timer/Timer";
import { useNavigate } from "react-router-dom";
import { getRandomWord } from "../../fetchers/getRandomWord";
import { saveDescription } from "../../fetchers/saveDescription";
import { checkDescription } from "../../fetchers/checkDescription";

export default function DescriberPage() {
  const [description, setDescription] = useState("");
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [word, setWord] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const roomId = "67013095bf8e9f7326e013f7";
  const teamId = "67013149420fd1486ca018e1";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmZkYmYxZGYwZWFmOGU0OTM5MzNkZmUiLCJpYXQiOjE3MjgxMzE0MDksImV4cCI6MTcyODEzNTAwOX0.idmkhIPwHQ0_F_fSOUYOeebIXACgQcb_xqz6kCB05_Y";

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const wordData = await getRandomWord(roomId, teamId, token);
        setWord(wordData);
      } catch {
        setMessage("Failed to load the word. Please try again later.");
      }
    };

    fetchWord();
  }, [roomId, teamId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isTimeUp || isSubmitted) {
      return;
    }

    if (!description.trim()) {
      setMessage("You must provide a valid description before submitting.");
      return;
    }

    try {
      const isValid = await checkDescription(description, word._id);

      if (!isValid) {
        setMessage(
          "Your description contains the word to describe, synonyms, or derivatives. Please try again."
        );
        return;
      }

      await saveDescription(roomId, teamId, description);

      setMessage(
        "Your description has been successfully submitted and recorded."
      );
      setDescription(""); // Clear the input field
      setIsSubmitted(true); // Mark as submitted
    } catch {
      setMessage("Failed to submit description. Please try again later.");
    }
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setDescription("");
    setMessage(
      "Time is up! You did not submit a description within the allowed time."
    );
  };

  if (isTimeUp) {
    navigate("/discussion");
  }

  return (
    <div className="container my-5">
      <section
        className="row justify-content-center align-items-center gap-5"
        style={{ marginTop: "8rem" }}
      >
        <div className="col-md-6 text-center">
          <h2 className="mb-4">
            {isTimeUp
              ? "Time's up!"
              : "Describe the Word Before Time Runs Out!"}
          </h2>
          <Timer initialCount={30} onTimeUp={handleTimeUp} />
        </div>
        <div className="col-md-6">
          {/* Section displaying the word and its synonyms */}
          {word ? (
            <div className="border p-3 mb-4 rounded">
              <h3 className="mb-2">
                Word to Describe: <strong>{word.word}</strong>
              </h3>
              <p>Synonyms: {word.similarWords.join(", ")}</p>
            </div>
          ) : (
            <div>Loading word...</div>
          )}
          <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Your Description
              </label>
              <textarea
                id="description"
                className="form-control form-control-lg"
                rows="4"
                autoComplete="off"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
                placeholder={
                  isTimeUp
                    ? "Time's up! Can't submit a description."
                    : "Write your description here"
                }
                disabled={isTimeUp || isSubmitted} // Disable input if time is up or already submitted
              />
            </div>
            <button
              className="btn btn-lg btn-success w-100"
              disabled={isTimeUp || isSubmitted} // Disable button if time is up or already submitted
            >
              Submit Your Description
            </button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}{" "}
          {/* Display feedback message */}
        </div>
      </section>
    </div>
  );
}
