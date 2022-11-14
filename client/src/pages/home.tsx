import React from "react";
import { useNavigate } from "react-router";
import { SAPIBase } from "../tools/api";
import axios from "axios";
import { createSearchParams } from "react-router-dom";
import { useInterval } from "../tools/interval";
import Header from "../components/Header";
import "./css/home.css";

interface IAPIResponse {_id: string, picture: string, title: string, content: string, createdAt: Date, diff: string }


const HomePage = (props: {}) => {
	const Oneday = 24*60*60;
	const Onehour = 60*60;
	const Onemin = 60;
	const navigate = useNavigate();
	const [AuctionItems, setAuctionItems] = React.useState<IAPIResponse[]>([]);
	const [SSearchItem, setSSearchItem] = React.useState<string>("");
	const [CurrentTime, setCurrentTime] = React.useState<Date>(new Date());

	React.useEffect( () => {
		const asyncFun = async () => {
			const { data } = await axios.get<IAPIResponse[]>(SAPIBase + `/feed/getfeed?search=${SSearchItem}`);
			setAuctionItems(data);
		}
		asyncFun().catch((e) => window.alert(`Erorr while running API Call: ${e}`));
	}, [SSearchItem]);

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

	return (
		<div className="home">
			<Header/>
			<div className={"moveToUpload btnFade btnWhite"} onClick={() => navigate('/upload')}>Upload my things!</div>
			{ AuctionItems.map((val, i) => {
				const DataDate = new Date(val.createdAt);
				DataDate.setDate(DataDate.getDate() + Number(val.diff));
				const diff = (DataDate.getTime()- CurrentTime.getTime()) / 1000;
				if(diff <= 0) return null;
				const [day, hour, minute, second] = [Math.floor(diff / Oneday), Math.floor(diff % Oneday / Onehour), Math.floor(diff % Onehour / Onemin), Math.floor(diff % Onemin)];
				return (
				<div key={i} className={"feed-item btnFade btnWhite"} onClick={() => goToGoods(val._id)}>
					<div className={"feed-picture"}>{val.picture}</div>
					<div className={"feed-title"}>{val.title}</div>
					<div className={"feed-content"}>Info: {val.content}</div>
					<div className={"feed-lefttime"}>Last Time: {day} days {hour} hours {minute} minutes {second} seconds</div>
				</div>
				);
			})}

		</div>
	)
}

export default HomePage;