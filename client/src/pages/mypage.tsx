import axios from "axios";
import React from "react";

const MyPage = () => {
    const getUserInfo = () => {
        const asyncFun = async () => {
            let token = localStorage.getItem('token');
            let id = localStorage.getItem('id');
            const { data } = await axios.post('/user/getUserInfobyIdToken', {id, token});
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