import React from "react";
import { useNavigate } from "react-router-dom";
import './css/Header.css'
const Header = () => {
	const navigate = useNavigate();
	return (
		<div className={"header"}>
			<div className={"auction-title"}>
				<div onClick={() => navigate('/')}>Sparcs Auction</div>
				<div onClick={() => navigate('/mypage')}>MyPage</div>
			</div>
			
			<div className={"Oneline"}></div>
		</div>
	);
}

export default Header;