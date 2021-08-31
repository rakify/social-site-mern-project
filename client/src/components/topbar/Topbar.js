import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useContext(AuthContext);
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">WhatsUp</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchBar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend or post"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">20</span>
          </div>
          <Link to="/messenger" className="topbarIconItem" style={{color:"white"}}>
            <Chat />
            <span className="topbarIconBadge">1</span>
          </Link>
          <Link to={`/profile/${user.username}`} className="topbarIconItem">
            <img src={user.profilePicture} alt="" className="topbarImg" />
          </Link>
        </div>
      </div>
    </div>
  );
}
