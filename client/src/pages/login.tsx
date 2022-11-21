import axios from "axios";
import React from "react";

const LoginPage = () => {
    const [UserName, setUserName] = React.useState("");
    const [Password, setPassword] = React.useState("");

    const getAccountInformation = () => {
        const asyncFun = async () => {
            
        }
        asyncFun().catch((e)=>{window.alert(`Error: ${e}`)})
    }

    const LoginClick = () => {
        axios.post('/user/getUserIdToken', {
            username: UserName,
            password: Password
        }).then((res)=>{
            localStorage.setItem('id', res.data.id)
            localStorage.setItem('token', res.data.token)
        }).catch((e)=>{window.alert(e);});
    }

    return (
        <div>
            <input type={"text"} value={UserName} onChange={(e)=>{setUserName(e.target.value)}}/>
            <input type={"text"} value={Password} onChange={(e)=>{setPassword(e.target.value)}}/>
            <div onClick={LoginClick}>Login</div>
        </div>
    )
}

export default LoginPage;