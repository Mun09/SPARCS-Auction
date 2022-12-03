import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { SAPIBase } from "../tools/api";
import { getRandom } from "../tools/getrandom";
import "./css/upload.css";

const Upload = (props: {}) => {
    type UploadImage = {file: File};

    const [Title, setTitle] = React.useState("");
    const [Content, setContent] = React.useState("");
    const [Time, setTime] = React.useState("0");
    const [PicturePostData, setPicturePostData] = React.useState<UploadImage | null>(null);
    const [ItemValue, setItemValue] = React.useState("1000");

    const navigate = useNavigate();

    const createNewItemAndsend = () => {
        const asyncFun = async () => {
            const random_id = String(getRandom());
            const id = localStorage.getItem("id");
            const token = localStorage.getItem("token");
            const postData = { _id: random_id, title: Title, content: Content, diff: Time, InitialValue: ItemValue, CurrentValue: ItemValue, id, token };
            const picData = new FormData();
            if(PicturePostData) {
                picData.append("picture", PicturePostData.file);
                picData.append("_id", random_id);
            }
            
            await axios.post( SAPIBase + '/feed/addFeed', postData);
            await axios.post( SAPIBase + '/feed/addPicture', picData, {});
            
            await axios.post( SAPIBase + '/user/addSelllist', { _id : random_id, id, token });

            setTitle("");
            setContent("");
            setTime("0");
            setPicturePostData(null);
            setItemValue("1000");
        }
        asyncFun().catch(
            (e) => {
                if(e.response && e.response.status == 401) {
                    window.alert(`Login first`);
                } else {
                    window.alert(`Error while running API Call: ${e}`);
                }
            }
        );
    }

    const createNewItem = () => {
        createNewItemAndsend();
        navigate('/');
    }

    const UploadPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if(fileList && fileList[0]) {
            setPicturePostData({ file: fileList[0] });
        }
    }
    
    return (
        <div>
            <Header />
            <div className={"item-add"}>
                Title: <input type={"text"} value={Title} onChange={(e)=>{setTitle(e.target.value)}} /><br/>
                Content: <textarea value={Content} onChange={(e)=>{setContent(e.target.value)}} /><br/>
                Picture: <input type={"file"} accept={".jpg, .png, .jpeg"} onChange={UploadPicture} /><br/>
                Auction Time: <input type={"number"} min="0" max="100" value={Time} onChange={(e)=>{setTime(e.target.value);}} /><br/>
                Value: <input type={"number"} min="1000" step="1000" value={ItemValue} onChange={(e)=>{setItemValue(e.target.value);}} /> won
                <div className={"Upload btnFade btnWhite"} onClick={() => createNewItem()}>Upload</div>
            </div>
        </div>
    )
}

export default Upload;