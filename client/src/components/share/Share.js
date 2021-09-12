import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
  PostAdd,
} from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useRef, useState } from "react";
import axios from "axios";

export default function Share() {
  const { user } = useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [validation, setValidation] = useState({ isLoading: false });

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user._id);
    formData.append("desc", desc.current.value);
    try {
      await axios.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
    <div className="shareContainer">
      <div className="shareWrapper">
        <form onSubmit={submitHandler}>
          <div className="shareTop">
            <img className="shareProfileImg" src={user.profilePicture} alt="" />
            <div className="shareInput">
              <input
                placeholder="Write your thoughts..."
                type="text"
                required
                className="shareInput"
                ref={desc}
              />
            </div>
          </div>
          <hr className="shareHr" />
          {file && (
            <div className="shareImgContainer">
              <img
                src={URL.createObjectURL(file)}
                className="shareImg"
                alt=""
              />
              <Cancel
                className="shareCancelImg"
                onClick={() => setFile(null)}
              />
            </div>
          )}
          <div className="shareBottom">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
            </label>
            <input
              style={{ display: "none" }}
              type="file"
              name=""
              id="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
            <div className="shareOption">
              <button
                className={
                  validation.isLoading ? "button--loading" : "shareButton"
                }
                type="submit"
                disabled={validation.isLoading}
              >
                <span className="button__text">
                  <PostAdd /> Publish
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
