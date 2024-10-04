import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Timer = ({ startTime, onTimeOut }) => {
  const [time, setTime] = useState(startTime);

  useEffect(() => {
    if (time === 0) {
      onTimeOut(); // Call action when time is out
      return; // Exit effect if time is 0
    }

    const timerId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId); // Clean up the timer
  }, [time, onTimeOut]);

  return <div className="text-white">Timer: {time} sec</div>;
};

// UserCard Component
const UserCard = ({ username }) => (
  <li className="list-group-item bg-dark text-white">{username}</li>
);

// TeamList Component
const TeamList = ({ teamName, users }) => (
  <div>
    <h5 className="text-white">Team {teamName}</h5>
    <ul className="list-group">
      {users.map((user, index) => (
        <UserCard key={index} username={user.username} />
      ))}
    </ul>
  </div>
);

// Main Wait Component
export default function Wait({ teamName, users, waitTime, role }) {
  const handleTimeOut = () => {
    // Action when time is up (optional)
    console.log("Time is up!");
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Left column: Timer and Team List */}
        <div className="col-md-3">
          {/* Timer */}
          <div className="mb-4 bg-dark p-3 rounded">
            <Timer startTime={waitTime} onTimeOut={handleTimeOut} />
          </div>
          {/* Team List */}
          <div className="bg-dark p-3 rounded">
            <TeamList teamName={teamName} users={users} />
          </div>
        </div>

        {/* Right column: Wait Message */}
        <div className="col-md-9 d-flex flex-column">
          {/* Wait Message */}
          <div
            className="bg-secondary rounded d-flex justify-content-center align-items-center flex-grow-1"
            style={{ minHeight: "250px" }}
          >
            <h6 className="text-white mb-0">{`Wait ${waitTime} sec until ${role}`}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
