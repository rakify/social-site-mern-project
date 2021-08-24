import "./closefriend.css";

export default function CloseFriend({user}) {
  const PU = process.env.REACT_APP_PUBLIC_URL;
  return (
    <li className="sidebarFriend">
      <img className="sidebarFriendImg" src={PU+user.profilePicture} alt="" />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}
