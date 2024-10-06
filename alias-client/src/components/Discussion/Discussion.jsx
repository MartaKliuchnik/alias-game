import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  return <div className="text-white">Timer {time} sec</div>;
};

// UserCard Component
const UserCard = ({ username }) => (
  <li className="list-group-item bg-dark text-white">
    {username}
  </li>
);

// TeamList Component
const TeamList = ({ teamName, users }) => (
  <div>
    <h5 className="text-white">Team {teamName}</h5>
    <ul className="list-group">
      {users?.map((user, index) => (
        <UserCard key={index} username={user.username} />
      ))}
    </ul>
  </div>
);

// Main Component
export default function Discussion({ teamName, users, description }) {
  return (
    <div className="container py-5">
      <div className="row">
        {/* Left column: Timer and Team List */}
        <div className="col-md-3">
          {/* Timer */}
          <div className="mb-4 bg-dark p-3 rounded">
            <Timer startTime={60} onTimeOut={() => { }} />
          </div>
          {/* Team List */}
          <div className="bg-dark p-3 rounded">
            <TeamList teamName={teamName} users={users} />
          </div>
        </div>

        {/* Right column: Description and Chat */}
        <div className="col-md-9 d-flex flex-column">
          {/* Description */}
          <div className="bg-dark text-white p-3 rounded mb-2">
            <h6 className="mb-1">Description</h6>
            <p className="mb-0">{description}</p>
          </div>

          {/* Empty Block for Chat */}
          <div className="bg-secondary rounded flex-grow-1">
            {/* Insert Chat component */}
          </div>
        </div>
      </div>
    </div>
  );
};