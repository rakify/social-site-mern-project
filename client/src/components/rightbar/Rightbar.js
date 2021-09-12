import "./rightbar.css";
import { useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";

export default function Rightbar({ user, friends }) {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const isFollowing = currentUser.followings.includes(user?._id);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return user ? (
    <div className="rightbarContainer">
      {user.username !== currentUser.username && (
        <div className="follow">
          <button className="rightbarFollowButton" onClick={handleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
            {isFollowing ? <Remove /> : <Add />}
          </button>
        </div>
      )}
      <div className="userInfo">
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Current City:</span>
            <span className="rightbarInfoValue">
              {currentUser ? currentUser.city : user.city}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Hometown:</span>
            <span className="rightbarInfoValue">
              {currentUser ? currentUser.hometown : user.hometown}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Gender:</span>
            <span className="rightbarInfoValue">
              {currentUser ? currentUser.gender : user.gender}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{user.relationship}</span>
          </div>
        </div>
      </div>
      <div className="userFollowings">
        <h4 className="rightbarTitle">User Followings</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link key={friend._id}
              to={`/profile/${friend.username}`}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  className="rightbarFollowingImg"
                  src={friend.profilePicture}
                  alt=""
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
