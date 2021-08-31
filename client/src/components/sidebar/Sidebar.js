import "./sidebar.css";
import NewUsers from "../newUsers/NewUsers";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [newUsers, setNewUsers] = useState([]);

  useEffect(() => {
    const getNewUsers = async () => {
      const res = await axios.get("/users/all/new");
      setNewUsers(res.data);
    };
    getNewUsers();
  }, []);

  return (
    <div className="sidebarContainer">
      <div className="sideWrapper">
        <hr className="sidebarHr" />
        <h3 style={{ color: "green" }}>New Users</h3>
        <ul className="sidebarFriendList">
          {newUsers.map((u) => (
              <NewUsers key={u._id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
}
