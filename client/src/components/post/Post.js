import { useState, useEffect, useContext } from "react";
import "./post.css";
import { MoreVert, ThumbUp, Comment } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const { user: currentUser } = useContext(AuthContext);

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="postContainer">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={user.profilePicture}
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={post.img} alt="" />
        </div>

        {isLiked && like === 1 ? (
          <span className="badge">You</span>
        ) : (
          ""
        )}
        {isLiked && like > 1 ? (
          <span className="badge">
            You and {like - 1} others
          </span>
        ) : (
          ""
        )}
        {!isLiked && like > 0 ? (
          <span className="badge">
          {like} People
          </span>
        ) : (
          ""
        )}
        <hr />
        <div className="postBottom">
          <div className="postBottomLeft">
            <span className="likeIcon" onClick={likeHandler}>
              <ThumbUp style={{ color: "gray" }} />
            </span>
            {isLiked ? "Unlike" : "Like"}
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              <Comment style={{ color: "gray" }} />
            </span>
            Add Comment
          </div>
        </div><hr />
      </div>
    </div>
  );
}
