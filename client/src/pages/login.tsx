import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { SAPIBase } from "../tools/api";
import "./css/login.css";

const LoginPage = () => {
    const [UserName, setUserName] = React.useState("");
    const [Password, setPassword] = React.useState("");
    const navigate = useNavigate();

    const LoginClick = () => {
        axios.post(SAPIBase + '/user/getUserIdToken', {
            username: UserName,
            password: Password
        }).then((res)=>{
            console.log(res);
            localStorage.setItem('id', res.data.id);
            localStorage.setItem('token', res.data.token);
            window.alert("Login Success!");
            navigate('/');
        }).catch((e)=>{
            window.alert("You are not member!");
        });
    }

    return (
        <div>
            <Header/>
            Your Name : <input type={"text"} value={UserName} onChange={(e)=>{setUserName(e.target.value)}}/><br/>
            Your Password : <input type={"text"} value={Password} onChange={(e)=>{setPassword(e.target.value)}}/>
            <div className={"LoginButton"} onClick={LoginClick}>Login</div><br/>
            <div className={"GotoRegisterButton"} onClick={()=>{navigate('/register')}}>Register</div>
        </div>
    )
}

export default LoginPage;