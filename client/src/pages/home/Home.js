import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import "./home.css";

export default function Home() {
  const width = window.innerWidth;
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Feed />
        {width>1000?<Sidebar />:""}
      </div>
    </>
  );
}
