import React from "react";
import "./message.css";
import {format} from "timeago.js"

export default function Message({ message, own }) {
  return (
    <div className={own ? "messageContainer own" : "messageContainer"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://images.unsplash.com/photo-1568452329428-e760163f262c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMGdpcmxzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
