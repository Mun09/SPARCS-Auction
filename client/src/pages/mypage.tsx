import axios from "axios";
import React from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import { SAPIBase } from "../tools/api";
import "./css/mypage.css";

const MyPage = () => {
    const [UserData, setUserData] = React.useState({name: ""});
	const navigate = useNavigate();
    
    React.useEffect(()=>{
        getUserInfo();
    },[]);

    const getUserInfo = () => {
        const asyncFun = async () => {
            let token = localStorage.getItem('token');
            let id = localStorage.getItem('id');
            const { data } = await axios.post(SAPIBase + `/user/getUserInfobyIdToken?id=${id}&token=${token}`);
            if(!data.success) {
                navigate('/login');
            }
            setUserData(data.data);
        }
        asyncFun().catch((e)=>{window.alert(`Error: ${e}`)})
    }

    const Logout = () => {
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <div>
            <Header/>
            Your Auction Information<br/>
            Id : {UserData.name}<br/>
            Your Auction Lists: <br/>

            <div style={{height: "300px"}}></div>
            <div className="Logout-button" onClick={Logout}>Logout</div>
        </div>
    )
}

export default MyPage;