import axios from "axios";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { SAPIBase } from "../tools/api";
import { IAPIPictureResponse, IAPIResponse } from "../tools/type";
import "./css/goods.css";

const Goods = (props: {}) => {
	const [ searchParams ] = useSearchParams();
	const id = searchParams.get('id');

	const [AuctionItem, setAuctionItem] = React.useState<IAPIResponse>();
	const [PictureItem, setPictureItem] = React.useState<IAPIPictureResponse>();
	const [AuctionMoney, setAuctionMoney] = React.useState("");
	const [CurrentCostState, setCurrentCostState] = React.useState<string | undefined>("");

	React.useEffect( () => {
		const asyncFun1 = async () => {
			const { data } = await axios.get<IAPIResponse[]>(SAPIBase + `/feed/getFeed?search=${id}`);
			if(data){
				setAuctionItem(data[0]);
				setCurrentCostState(AuctionItem?.CurrentValue);
			}
		}
		const asyncFun2 = async () => {
			const { data } = await axios.get<IAPIPictureResponse[]>(SAPIBase + `/feed/getPicture?search=${id}`);
			if(data) setPictureItem(data[0]);
		}
		asyncFun1().catch((e) => window.alert(`Erorr while running API Call: ${e}`));
		asyncFun2().catch((e) => window.alert(`Erorr while running API Call: ${e}`));
	}, [id, CurrentCostState]);


	const ClickAuction = () => {
		const asyncFun = async () => {
			const { data } = await axios.post(SAPIBase + `/auction/postAuction?money=${AuctionMoney}&id=${id}`);
			if(data.success) {
				window.alert(`You Got It!`);
				setCurrentCostState(data.data.CurrentValue);
				console.log(data.data);
			}
			else window.alert(`You Missed It!`);
		}
		asyncFun().catch((e)=>window.alert(`error: ${e}`));
	}

	if(AuctionItem == null || PictureItem == null) {
		return <div>Loading...</div>
	}
	return (
		<div>
			<Header />
			<img src={PictureItem.picture} alt="empty thumbnail" className="Item-picture"/>
			<div className="Item-id">Item-Id: {AuctionItem._id}</div>
			<hr className="oneline"></hr>
			<div className="Item-title">Title: {AuctionItem.title}</div>
			<hr className="oneline"></hr>
			<div className="Item-content">Info: {AuctionItem.content}</div>
			<hr className="oneline"></hr>
			<div className="Item-currentvalue">Current Cost: {CurrentCostState}</div>
			<hr className="oneline"></hr>
			<input type="number" value={AuctionMoney} min="1000" step="1000" className="Auction-button" onChange={(e)=>{setAuctionMoney(e.target.value)}}/>
			<div className="Auction-button" onClick={ClickAuction}>Wanna Auction?</div>
		</div>
	);
}

export default Goods;