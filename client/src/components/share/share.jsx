import './share.css'
import { AuthContext } from '../../context/authContext';
import {useContext,useState,useRef} from "react"
import {PermMedia,Label,Room,EmojiEmotions,Cancel} from "@mui/icons-material";
import axios from "axios";


function Share() {
    const {user}=useContext(AuthContext);
    const public_folder=process.env.REACT_APP_PUBLIC_FOLDER;
    
    const Desc=useRef();
    const [file, setFile]=useState(null)


    const submitHandler=async(e)=>{
        e.preventDefault();

        const newPost={
            userId: user._id,
            desc:Desc.current.value,
        }

        if(file){
            const data=new FormData();
            const fileName=file.name;
            data.append("file",file)
            newPost.img=fileName;

            try{
                await axios.post("/upload",data)
            }catch(err){
             console.log(err)
            }
        }
        try{
            await axios.post("/posts",newPost)
            window.location.reload();
        }catch(err){
         console.log(err)
        }
    };

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img src={user.profilePicture?public_folder+user.profilePicture:public_folder+"person/noAvatar.png"} alt="profile pic" className="shareProfileImg" />
                    <input placeholder={"What's on your mind, "+user.username+"?"} className="shareInput" ref={Desc} />
                </div>
                <hr className="shareLine" />
                {file&&(
                    <div className="shareImgContainer">
                        <img src={URL.createObjectURL(file)} alt="share img link" className="shareImg" />
                        <Cancel className="cancelImg" onClick={()=>setFile(null)}/>
                    </div>
                )}
                <form className="shareBottom" onSubmit={submitHandler}>
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon"/>
                            <span className="shareOptionText">Photo/Video</span>
                            <input type="file" style={{display:"none"}} id="file" accept=".png,.jpeg,jpg" onChange={(e)=>setFile(e.target.files[0])}/>
                        </label>
                        <div className="shareOption">
                            <Label htmlColor="DodgerBlue" className="shareIcon"/>
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="green" className="shareIcon"/>
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" type="submit">Share</button>
                </form>
            </div>
        </div>
    )
}

export default Share
