import "./comments.css";
import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { Send } from "@material-ui/icons";

export default function Comments({ postId, user }) {
  const text = useRef();
  const [comments, setComments] = useState([]);
  const [validation, setValidation] = useState({ isLoading: false });

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get(`/posts/comments/all?postId=${postId}`);
      setComments(res.data);
    };
    fetchComments();
  }, [postId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const comment = {
      username: user.username,
      userId: user._id,
      userImg: user.profilePicture,
      text: text.current.value,
      postId: postId,
    };
    try {
      await axios.post(`/posts/${postId}/comment`, comment);
      setValidation({
        type: "success",
        isLoading: true,
        text: "Just a second!",
      });
      window.setTimeout(function () {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setValidation({
        type: "error",
        isLoading: false,
        text: err.response.data.message.slice(34),
      });
    }
  };

  const deleteHandler = async (id, cuid) => {
    try {
      window.confirm("Are you sure?") &&
        (await axios.delete(`/posts/comment/${id}`, {
          data: { userId: user._id },
        })) &&
        window.setTimeout(function () {
          window.location.reload();
        }, 500);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <input
          className="commentInput"
          placeholder="Write a comment..."
          type="text"
          required
          ref={text}
        />
        <button
          className={validation.isLoading ? "button--loading" : ""}
          type="submit"
          disabled={validation.isLoading}
        >
          <span className="button__text">
            <Send /> Send
          </span>
        </button>
      </form>

      <div className={validation?.type}>{validation?.text}</div>

      <div className="comment-heading">
        {comments.length > 0 && "Showing Recent Comments (At most 4)"}
      </div>

      {comments.length > 0 && (
        <div className="comment-thread">
          {comments.map((c, i) => (
            <div className="comment" key={i}>
              <div className="comment-heading">
                <div className="comment-info">
                  <Link
                    to={`/profile/${c.username}`}
                    className="comment-author"
                  >
                    <Avatar src={c.userImg} />
                    {c.username}
                  </Link>
                </div>
                <div
                  onClick={() => deleteHandler(c._id, c.userId)}
                  className="comment-date"
                >
                  &bull; {format(c.createdAt)}
                </div>
              </div>

              <div className="comment-body">
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
