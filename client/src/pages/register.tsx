import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { SAPIBase } from "../tools/api";

const RegisterPage = () => {
    const [UserName, setUserName] = React.useState("");
    const [Password, setPassword] = React.useState("");
    const [RegisterResult, setRegiseterResult] = React.useState(false);
    const navigate = useNavigate();

    const RegisterHandler = () => {
        const asyncFun = async () => {
            const { data } = await axios.post(SAPIBase + `/user/register` , {username: UserName, password: Password});
            setRegiseterResult(data.success);
            if(RegisterResult == true) {
                window.alert("Register Success! Login again!");
                navigate('/');
            } else {
                window.alert("Register Fail! Use another name!");
            }
        }
        asyncFun().catch((e)=>{
            window.alert(`Error: ${e}`)
        });
    }

    return (
        <div>
            <Header/>
            Your Register Name : <input type={"text"} value={UserName} onChange={(e)=>{setUserName(e.target.value)}}/><br/>
            Your Register Password : <input type={"text"} value={Password} onChange={(e)=>{setPassword(e.target.value)}}/>
            <div className={"RegisterButton"} onClick={RegisterHandler}>Register!</div>
        </div>
    );
}

export default RegisterPage;