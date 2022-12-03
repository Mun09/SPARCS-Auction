import React from "react";
import { useNavigate } from "react-router";
import { SAPIBase } from "../tools/api";
import axios from "axios";
import { createSearchParams } from "react-router-dom";
import { useInterval } from "../tools/interval";
import Header from "../components/Header";
import "./css/home.css";
import { IAPIPictureResponse, IAPIResponse } from "../tools/type";
import { Oneday, Onehour, Onemin } from "../tools/constants";

const HomePage = (props: {}) => {
	const navigate = useNavigate();
	const [AuctionItems, setAuctionItems] = React.useState<IAPIResponse[]>([]);
	const [AuctionItemPicture, setAuctionItemPicture] = React.useState<IAPIPictureResponse[]>([]);
	const [SSearchItem, setSSearchItem] = React.useState<string>("");
	const [CurrentTime, setCurrentTime] = React.useState<Date>(new Date());
	const [Reloading, setReloading] = React.useState(false);

	React.useEffect( () => {
		const asyncFun1 = async () => {
			var { data } = await axios.get<IAPIResponse[]>(SAPIBase + `/feed/getFeed?search=${SSearchItem}`);
			setAuctionItems(data);
			return data;
		}
		const asyncFun2 = async (id="") => {
			const { data } = await axios.get<IAPIPictureResponse[]>(SAPIBase + `/feed/getPicture?search=${""}`);
			setAuctionItemPicture(data);
			return data;
		}
		asyncFun1().then((data)=>{
			asyncFun2()
		}).catch((e) => window.alert(`Erorr while running API Call: ${e}`));
	}, [SSearchItem, Reloading]);

	useInterval( () => {
		setCurrentTime(new Date());
	}, 500);

	const goToGoods = ( id: string ) => {
		navigate({
			pathname:'/goods',
			search: createSearchParams({
				id: id
			}).toString()
		});
	}

	const showImage = ( item: any) => {
		const { _id } = item;
		const wanted = AuctionItemPicture.filter((value) => {
			return value._id === _id;
		});
		const imageFile = wanted[0];
		if(!imageFile && imageFile == null) {
			return <img src={"/img/default_book.png"} alt="empty thumbnail"></img>
		}
		return <img src={`${imageFile.picture}`} alt={imageFile._id}/>
	}

	const deleteItem = ( item: any ) => {
		const { _id } = item;
		const asyncFun = async () => {
			const { data } = await axios.post(SAPIBase + '/feed/deleteItem', {id: _id});
			return data;
		}
		asyncFun().then((r)=>setReloading(!Reloading)).catch((e)=>{console.log(`Delete Error: ${e}`)});
	}

	return (
		<div className="home">
			<Header/>
			<div className={"moveToUpload btnFade btnWhite"} onClick={() => navigate('/upload')}>Upload my things!</div>
			<span className="search-text">Search</span><input type={"text"} className="textSearch-button" onChange={(e)=>{setSSearchItem(e.target.value)}} />
			<div className="home-items">
			{ AuctionItems.map((val, i) => {
				const DataDate = new Date(val.createdAt);
				DataDate.setDate(DataDate.getDate() + Number(val.diff));
				const diff = (DataDate.getTime()- CurrentTime.getTime()) / 1000;
				if(diff <= 0) {
					deleteItem({_id: val._id});
					return null;
				}
				const [day, hour, minute, second] = [Math.floor(diff / Oneday), Math.floor(diff % Oneday / Onehour), Math.floor(diff % Onehour / Onemin), Math.floor(diff % Onemin)];
				return (
				<div key={i} className={"feed-item btnFade btnWhite"} onClick={() => goToGoods(val._id)}>
					<div className={"feed-picture"}>{showImage({_id: val._id})}</div>
					<div className={"feed-title"}>Name: {val.title}</div>
					<div className={"feed-content"}>Info: {val.content}</div>
					<div className={"feed-value"}>Value: {val.CurrentValue} won</div>
					<div className={"feed-lefttime"}>Last Time: {day} days {hour} hours {minute} minutes {second} seconds</div>
				</div>
				);
			})}
			</div>

		</div>
	)
}

export default HomePage;