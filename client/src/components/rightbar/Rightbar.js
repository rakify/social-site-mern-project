import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";

export default function Rightbar({ user }) {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  );

  useEffect(() => {
    if (user) {
      const getFriends = async () => {
        try {
          const friendList = await axios.get(`/users/friends/${user._id}`);
          setFriends(friendList.data);
        } catch (err) {
          console.log(err);
        }
      };
      getFriends();
    }
  }, [user]);

  const handleFollow = async () => {
    try {
      if (followed) {
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
    setFollowed(!followed);
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContiner">
          <img className="birthdayImg" src="/assets/gift.png" alt="" />
          <span className="birthayText">
            <b>Max Weiber</b> and <b>3 other friends</b> have birthday today.
          </span>
        </div>
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleFollow}>
            {followed ? "Unfollow" : "Follow"} {followed ? <Remove /> : <Add />}
          </button>
        )}
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
        <h4 className="rightbarTitle">User Followings</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
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
      </>
    );
  };

  return (
    <div className="rightbarContainer">
      <div className="rightbarWrapper"></div>
      {user ? <ProfileRightbar /> : <HomeRightbar />}
    </div>
  );
}
