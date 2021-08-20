import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";

export default function Rightbar({ profile }) {
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
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Current City:</span>
            <span className="rightbarInfoValue">Dhaka</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Hometown:</span>
            <span className="rightbarInfoValue">Narsingdi</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">Single</span>
          </div>
        </div>
        <h4 className="rightbarTitle">Followings</h4>
        <div className="rightbarFollowings">
          <div className="rightbarFollowing">
            <img
              className="rightbarFollowingImg"
              src="/assets/person/1.jpeg"
              alt=""
            />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img
              className="rightbarFollowingImg"
              src="/assets/person/2.jpeg"
              alt=""
            />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img
              className="rightbarFollowingImg"
              src="/assets/person/3.jpeg"
              alt=""
            />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img
              className="rightbarFollowingImg"
              src="/assets/person/4.jpeg"
              alt=""
            />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img
              className="rightbarFollowingImg"
              src="/assets/person/5.jpeg"
              alt=""
            />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img
              className="rightbarFollowingImg"
              src="/assets/person/6.jpeg"
              alt=""
            />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="rightbarContainer">
      <div className="rightbarWrapper"></div>
      {profile ? <ProfileRightbar /> : <HomeRightbar />}
    </div>
  );
}
