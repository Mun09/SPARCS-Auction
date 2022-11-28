import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SAPIBase } from "../tools/api";
import './css/Header.css'
const Header = () => {
	const [LoginState, setLoginState] = React.useState(false);
	useEffect( () => {
		const AsyncFun = async () => {
			const id = localStorage.getItem('id');
			const token = localStorage.getItem('token');
			const res = await axios.post(SAPIBase + `/user/getUserInfobyIdToken?id=${id}&token=${token}`);
			if(res.data.success == true) {
				setLoginState(true);
			} else {
				setLoginState(false);
			}
		}
		AsyncFun();
	}, [LoginState])

	const navigate = useNavigate();
	return (
		<div className={"header"}>
			<div className={"auction-title"}>
				<div onClick={() => navigate('/')}>Sparcs Auction</div>
				{
					LoginState ?
					<div onClick={() => navigate('/mypage')}>MyPage</div> :
					<div onClick={() => navigate('/login')}>Login</div>
				}
			</div>
			
			<div className={"Oneline"}></div>
		</div>
	);
}

export default Header;