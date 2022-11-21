import axios from "axios";
import React from "react";
import { useNavigate } from "react-router";
import { SAPIBase } from "../tools/api";

const MyPage = () => {
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
                console.log(data);
                navigate('/login');
            }
        }
        asyncFun().catch((e)=>{window.alert(`Error: ${e}`)})
    }

    return (
        <div>
            This is mypage
        </div>
    )
}

export default MyPage;