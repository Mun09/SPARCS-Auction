import axios from "axios";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { SAPIBase } from "../tools/api";
import "./css/goods.css";

interface IAPIResponse {_id: string, title: string, content: string, createdAt: Date, diff: string }
interface IAPIPictureResponse {_id: string, picture: string}

const Goods = (props: {}) => {
	const [ searchParams ] = useSearchParams();
	const id = searchParams.get('id');

	const [AuctionItem, setAuctionItem] = React.useState<IAPIResponse>();
	const [PictureItem, setPictureItem] = React.useState<IAPIPictureResponse>();
	const [AuctionMoney, setAuctionMoney] = React.useState("");

	React.useEffect( () => {
		const asyncFun1 = async () => {
			const { data } = await axios.get<IAPIResponse[]>(SAPIBase + `/feed/getFeed?search=${id}`);
			if(data) setAuctionItem(data[0]);
		}
		const asyncFun2 = async () => {
			const { data } = await axios.get<IAPIPictureResponse[]>(SAPIBase + `/feed/getPicture?search=${id}`);
			if(data) setPictureItem(data[0]);
		}
		asyncFun1().catch((e) => window.alert(`Erorr while running API Call: ${e}`));
		asyncFun2().catch((e) => window.alert(`Erorr while running API Call: ${e}`));
	}, [id]);

	const ClickAuction = () => {
		const asyncFun = async () => {
			const {data} = await axios.get(SAPIBase + `/auction/postAuction?money=${AuctionMoney}&id=${id}`);
			
		}
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

			<input type="number" min="1000" className="Auction-button" onChange={(e)=>{setAuctionMoney(e.target.value)}}/>
			<div className="Auction-button" onClick={ClickAuction}>Wanna Auction?</div>
		</div>
	);
}

export default Goods;