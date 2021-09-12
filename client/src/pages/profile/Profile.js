import { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./profile.css";
import { useParams } from "react-router";

export default function Profile() {
    const [user, setUser] = useState();
    const [friends, setFriends] = useState([]);

    const username = useParams().username;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/users?username=${username}`);
        setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUser();
    }, [username]);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axios.get(`/users/friends/${ user._id }`);
                setFriends(friendList.data);
            } catch (err) {
                console.log(err);
            }
        };
        user && getFriends();
    }, [user]);

    // console.log(user)
    return (
        <>
            <Topbar />
            <div className="profileTop">
                <div className="profileCover">
                    <img src={user?.coverPicture} alt="" />
                </div>
                <div className="profileImg">
                    <img src={user?.profilePicture} alt="" />
                </div>
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user?.username}</h4>
                <span className="profileInfoDesc">{user?.desc}</span>
            </div>
            <Rightbar user={user} friends={friends} />
            <Feed username={username} />
        </>
    );
}