import './rightbar.css'
import { useContext,useEffect, useState } from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'
import { AuthContext } from '../../context/authContext';
import {Add, Remove} from "@mui/icons-material";

function Rightbar({user}) {
    const public_folder=process.env.REACT_APP_PUBLIC_FOLDER
    const [friends,setFriends]=useState([])
    const {user:currentUser, dispatch}=useContext(AuthContext);
    const [following,setFollowing]=useState(currentUser.following.includes(user?.id));


    useEffect(() => {
      const getFriends = async () => {
        try {
          const friendList = await axios.get("/users/friends/" + user._id);
          setFriends(friendList.data);
        } catch (err) {
          console.log(err);
        }
      };
      getFriends();
    }, [user]);


    const handleClick = async () => {
      try {
        if (following) {
          await axios.put("/users/"+user._id+"/unfollow",{userId:currentUser._id})
          dispatch({ type: "UNFOLLOW", payload: user._id });
        } 
       
        else {
          await axios.put("/users/"+user._id+"/follow",{userId:currentUser._id})
          dispatch({ type: "FOLLOW", payload: user._id });
        }
        setFollowing(!following);
      } 
      catch (err) {
        console.log(err)
      }
    
    };

    const ProfileRightbar=()=>{
        return (
          <>
            {user.username!==currentUser.username&&
            (
               <button className="rightbarFollowButton" onClick={handleClick}>
                   {following?"Unfollow":"Follow"}
                   {following? <Remove/>:<Add/>}
                 </button>
            )
            }

            <h4 className="rightbarTitle">User information</h4>
            <div className="rightbarInfo">
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">City:</span>
                <span className="rightbarInfoValue">{user.city}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">From:</span>
                <span className="rightbarInfoValue">{user.from}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Relationship:</span>
                <span className="rightbarInfoValue">
                  {user.relationship === 1
                    ? "Single"
                    : user.relationship === 2
                    ? "Married"
                    : "-"}
                </span>
              </div>
            </div>
            <h4 className="rightbarTitle">User friends</h4>
            <div className="rightbarFollowings">
            {friends.map((friend) => (
                 <Link to={"/profile/"+friend.username} style={{textDecoration:"none"}}>
                <div className="rightbarFollowing">
                <img
                  src={friend.profilePicture?public_folder+friend.profilePicture:public_folder+"person/noAvatar.png"}
                  alt="friend profile picture"
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
              </Link>
              ))}
            </div>
          </>
        );
    }

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
              <ProfileRightbar/>
            </div>
        </div>
        
    )
}

export default Rightbar
