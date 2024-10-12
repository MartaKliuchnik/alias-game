/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL);

export default function Chat({ userId, roomId, teamId, name, userName, role }) {
  console.log("role: ", role);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (teamId) {
      // Joining the team in the room
      socket.emit("joinTeam", { roomId, teamId });
      setMessages([]);

      // Listening for new messages from the server
      const messageHandler = (messageHand) => {
        if (messageHand.teamId === teamId) {
          setMessages((prevMessages) => [...prevMessages, messageHand]);
        }
      };

      socket.on("receiveMessage", messageHandler);

      // Cleanup the socket listener when the component unmounts or teamId changes
      return () => {
        socket.off("receiveMessage");
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const sendMessage = () => {
    if (!text.trim()) return; // Avoid sending empty messages
    const newMessage = { roomId, teamId, text, userId, userName };
    socket.emit("sendMessage", newMessage);
    setText("");
    if (inputRef.current) {
      inputRef.current.focus(); // Automatically focus the input after sending
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage(); // Send the message on pressing Enter
    }
  };

  useEffect(() => {
    // Automatically scroll to the bottom when a new message is received
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Only focus the input field if it's available (when role is not "describer")
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [role]);

  return (
    <div className="container">
      <div className="Chat card">
        <div className="card-body">
          <h2 className="card-title">Chat Room Team: {name}</h2>
          <div className="chat-window border rounded p-3 mb-3">
            <div
              className="messages"
              style={{
                height: "40vh",
                overflowY: "auto",
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.userId === userId ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    className={
                      msg.teamId === teamId ? "alert" : "alert alert-secondary"
                    }
                    style={{
                      backgroundColor:
                        msg.userId === userId ? "lightblue" : "lightgray",
                      maxWidth: "50%",
                      margin: "5px",
                    }}
                  >
                    <strong>
                      {msg.userId === userId ? userName : msg.userName}:
                    </strong>{" "}
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Only render input if role is not 'describer' */}
            {role !== "describer" && (
              <div className="message-input input-group mt-3">
                <input
                  type="text"
                  placeholder="Enter the message"
                  className="form-control"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown} // Detect Enter key press
                  ref={inputRef} // Reference for the input field
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                  Send message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
