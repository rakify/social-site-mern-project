import axios from "axios";
import { useState, useEffect } from "react";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios(`/users?userId=${friendId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [conversation, currentUser]);

  return (
    <div className="conversationContainer">
      <img
        className="conversationImg"
        src={user?.profilePicture}
        alt=""
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
