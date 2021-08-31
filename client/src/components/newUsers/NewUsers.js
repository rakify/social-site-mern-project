import "./newusers.css";
import { Link } from "react-router-dom";

export default function NewUsers({ user }) {
  return (
    <Link className="newUserLink" to={`/profile/${user.username}`}>
      <li className="sidebarFriend">
        <img className="sidebarFriendImg" src={user.profilePicture} alt="" />
        <span className="sidebarFriendName">{user.username}</span>
      </li>
    </Link>
  );
}
