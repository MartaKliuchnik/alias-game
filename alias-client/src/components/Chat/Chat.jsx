import React, { useEffect, useState } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [team, setTeam] = useState(null);

    return (
        <div className="container">
            <div className="text-center my-4">
                <h1>Chat Example Debug</h1>
                <div className="btn-group mb-3">
                    <button className="btn btn-outline-primary" onClick={() => setTeam('1')}>Select Team 1</button>
                    <button className="btn btn-outline-secondary" onClick={() => setTeam('2')}>Select Team 2</button>
                    <button className="btn btn-outline-success" onClick={() => setTeam('3')}>Select Team 3</button>
                </div>
            </div>
            <div className="Chat card">
                <div className="card-body">
                    <h2 className="card-title">Chat Room Team Id: {team}</h2>
                    {team && (
                        <h2 className="card-subtitle mb-2">Selected team: <strong>{team}</strong></h2>
                    )}

                    <div className="chat-window border rounded p-3 mb-3">
                        <h4>Chat:</h4>
                        <div className="messages">
                            {/* {messages.map((msg, index) => (
                                <div key={index} className={msg.team === team ? "alert alert-primary" : "alert alert-secondary"}>
                                    <strong>{msg.team}:</strong> {msg.text}
                                </div>
                            ))} */}
                        </div>
                        <div className="message-input input-group mt-3">
                            <input
                                type="text"
                                placeholder="Enter the message"
                                className="form-control"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={() => console.log('Send message')}>Send message</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
