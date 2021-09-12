import "./editPost.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
  PostAdd,
} from "@material-ui/icons";
import { useRef, useState } from "react";
import axios from "axios";

export default function EditPost({ post, user }) {
  const desc = useRef();
  const [updateFile, setUpdateFile] = useState(post.img ? post.img : null);
  const [validation, setValidation] = useState({ isLoading: false });
  
  const editSubmitHandler = async (e) => {
    e.preventDefault();

    const data = new FormData();
    if (updateFile !== null || updateFile !== post.img)
      data.append("updateFile", updateFile);
    if (updateFile === null) data.append("noImg", true);
    data.append("userId", user._id);
    data.append("desc", desc.current.value);
    try {
      await axios.put(`/posts/${post._id}`, data);
      setValidation({
        isLoading: true,
      });
      window.setTimeout(function () {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="editContainer">
      <div className="editWrapper">
        <form onSubmit={editSubmitHandler}>
          <div className="editTop">
            <img className="editProfileImg" src={user.profilePicture} alt="" />
            <div className="editInput">
              <input
                defaultValue={post.desc}
                type="text"
                required
                className="editInput"
                ref={desc}
              />
            </div>
          </div>
          <hr className="editHr" />
          {updateFile && (
            <div className="editImgContainer">
              <img
                src={
                  updateFile && post.img
                    ? post.img
                    : URL.createObjectURL(updateFile)
                }
                className="editImg"
                alt=""
              />
              <Cancel
                className="editCancelImg"
                onClick={() => setUpdateFile(null)}
              />
            </div>
          )}
          <div className="editBottom">
            <label htmlFor="updateFile" className="editOption">
              <PermMedia htmlColor="tomato" className="editIcon" />
              <span className="editOptionText">Photo or Video</span>
            </label>
            <input
              style={{ display: "none" }}
              type="file"
              id="updateFile"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => setUpdateFile(e.target.files[0])}
            />
            <div className="editOption">
              <Label htmlColor="blue" className="editIcon" />
              <span className="editOptionText">Tag</span>
            </div>
            <div className="editOption">
              <Room htmlColor="green" className="editIcon" />
              <span className="editOptionText">Location</span>
            </div>
            <div className="editOption">
              <EmojiEmotions htmlColor="goldenrod" className="editIcon" />
              <span className="editOptionText">Feelings</span>
            </div>
            <div className="editOption">
              <button
                className={
                  validation.isLoading ? "button--loading" : "editButton"
                }
                type="submit"
                disabled={validation.isLoading}
              >
                <span className="button__text">
                  <PostAdd /> Update
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
