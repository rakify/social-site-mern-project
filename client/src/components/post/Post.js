import { useState, useEffect, useContext } from "react";
import "./post.css";
import Comments from "../comments/Comments";
import EditPost from "../editPost/EditPost";
import { Edit, Delete, ThumbUp, Comment } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const { user: currentUser } = useContext(AuthContext);

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [showComment, setShowComment] = useState(false);

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

  const editHandler = () => {
    setShowEdit(!showEdit);
  };

  const deleteHandler = async () => {
    try {
      window.confirm("Are you sure?") &&
        (await axios.delete(`/posts/${post._id}`, {
          data: { userId: currentUser._id },
        })) &&
        window.setTimeout(function () {
          window.location.reload();
        }, 1000);
    } catch (err) {
      console.log(err);
    }
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
          {user.username === currentUser.username && (
            <div className="postTopRight">
              <button className="postTopRightEdit" onClick={editHandler}>
                <Edit />
              </button>
              <button className="postTopRightDelete" onClick={deleteHandler}>
                <Delete />
              </button>
            </div>
          )}
        </div>

        {showEdit && <EditPost user={currentUser} post={post} />}

        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={post.img} alt="" />
        </div>

        {isLiked && like === 1 ? (
          <span className="badge">You</span>
        ) : isLiked && like === 2 ? (
          <span className="badge">You and {like - 1} other</span>
        ) : isLiked && like > 2 ? (
          <span className="badge">You and {like - 1} others</span>
        ) : !isLiked && like === 1 ? (
          <span className="badge">1 People</span>
        ) : !isLiked && like > 1 ? (
          <span className="badge">{like} Peoples</span>
        ) : (
          ""
        )}

        <hr />

        <div className="postBottom">
          <div className="postBottomLeft" onClick={likeHandler}>
            <span className="likeIcon">
              {isLiked ? (
                <ThumbUp style={{ color: "green" }} />
              ) : (
                <ThumbUp style={{ color: "gray" }} />
              )}
            </span>
            {isLiked ? "Unlike" : "Like"}
          </div>
          <div
            className="postBottomRight"
            onClick={() => setShowComment(!showComment)}
          >
            <span className="postCommentText">
              {post.comments.length === 0 ? (
                <Comment style={{ color: "gray" }} />
              ) : (
                <Comment style={{ color: "green" }} />
              )}
            </span>
            {post.comments.length > 1
              ? `${post.comments.length} Comments`
              : post.comments.length === 1
              ? `1 Comment`
              : "Add Comment"}
          </div>
        </div>
        <hr />
        {showComment && (
          <div className="postComments">
            <Comments
              postId={post._id}
              user={currentUser}
            />
          </div>
        )}
      </div>
    </div>
  );
}
