import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { SAPIBase } from "../tools/api";
import { getRandom } from "../tools/getrandom";
import "./css/upload.css";

const Upload = (props: {}) => {
    const [Title, setTitle] = React.useState("");
    const [Content, setContent] = React.useState("");
    const [Picture, setPicture] = React.useState("");
    const [Time, setTime] = React.useState("0");

    const navigate = useNavigate();

    const createNewItemAndsend = () => {
        const asyncFun = async () => {
            const random_id = getRandom();
            await axios.post( SAPIBase + '/feed/addFeed', { _id: random_id, title: Title, content: Content, picture: Picture, diff: Time } );
            setTitle("");
            setContent("");
            setPicture("");
            setTime("0");
        }
        asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    }

    const createNewItem = () => {
        createNewItemAndsend();
        navigate('/');
    }
    
    return (
        <div>
            <Header />
            <div className={"item-add"}>
                Title: <input type={"text"} value={Title} onChange={(e)=>{setTitle(e.target.value)}} /><br/>
                Content: <textarea value={Content} onChange={(e)=>{setContent(e.target.value)}} /><br/>
                Picture: <input type={"text"} value={Picture} onChange={(e)=>{setPicture(e.target.value)}} /><br/>
                Auction Time: <input type={"number"} min="0" max="100" value={Time} onChange={(e)=>{setTime(e.target.value)}} />
                <div className={"Upload btnFade btnWhite"} onClick={() => createNewItem()}>Upload</div>
            </div>
        </div>
    )
}

export default Upload;