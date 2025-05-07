import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addUserMessage, fetchBotReply } from "./chatSlice";
import "./Chat.css";

function Chat() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const status = useSelector((state) => state.chat.status);
  const error = useSelector((state) => state.chat.error);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    dispatch(addUserMessage(input));
    dispatch(fetchBotReply(input));
    setInput("");
  };

  // Scroll to the bottom when messages change
  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-container">
      <h2>ChatBot</h2>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.from}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Show loading state */}
      {status === "loading" && (
        <div className="loading-indicator">Bot is typing...</div>
      )}

      {/* Show error message if any */}
      {status === "failed" && (
        <div className="error-message">Error: {error}</div>
      )}

      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
