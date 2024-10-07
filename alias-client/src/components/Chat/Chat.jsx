import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080');

// eslint-disable-next-line react/prop-types
export default function Chat({getIdFromToken, teamId, name, role}) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [roomId] = useState('1');

    const userId = getIdFromToken();

    useEffect(() => {
        if (teamId) {
            socket.emit('joinTeam', {roomId, teamId});

            setMessages([]);

            const messageHandler = (messageHand) => {
                if (messageHand.teamId === teamId) {
                    setMessages((prevMessages) => {
                        if (!prevMessages.find(msg => msg.text === messageHand.text && msg.userId === messageHand.userId)) {
                            return [...prevMessages, messageHand];
                        }
                        return prevMessages;
                    });
                }
            }

            socket.on('receiveMessage', messageHandler);

            return () => {
                socket.off('receiveMessage');
            };
        }
    }, [teamId, roomId]);

    const sendMessage = () => {
        if (!text.trim()) return;
        const newMessage = {userId, text, teamId};
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit('sendMessage', {roomId, teamId, text, userId});
        setText('');
    };

    return (
        <div className="container">
            <div className="Chat card">
                <div className="card-body">
                    <h2 className="card-title">Chat Room Team: {name}</h2>
                    <div className="chat-window border rounded p-3 mb-3">
                        <h4>Chat:</h4>
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <div key={index}
                                     className={msg.team === teamId ? "alert alert-primary" : "alert alert-secondary"}>
                                    <strong>{msg.userId}:</strong> {msg.text}
                                </div>
                            ))}
                        </div>
                        {(role !== 'describer') &&
                            <div className="message-input input-group mt-3">
                                <input
                                    type="text"
                                    placeholder="Enter the message"
                                    className="form-control"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={sendMessage}>Send message</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
