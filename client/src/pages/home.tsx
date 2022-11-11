import React from "react";
import { useNavigate } from "react-router";
import { SAPIBase } from "../tools/api";
import axios from "axios";
import { createSearchParams } from "react-router-dom";
import { useInterval } from "../tools/interval";
import Header from "../components/Header";

interface IAPIResponse {_id: string, picture: string, title: string, content: string, timestamp: Date }


const HomePage = (props: {}) => {
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
			
			{ AuctionItems.map((val, i) => {
				const diff = (CurrentTime.getTime() - val.timestamp.getTime()) / (1000 * 3600 * 24);
				if(diff <= 0) return null;
				return (
				<div key={i} className={"feed-item"} onClick={() => goToGoods(val._id)}>
					<div className={"feed-picture"}>{val.picture}</div>
					<div className={"feed-content"}>{val.content}</div>
					<div className={"feed-lefttime"}>{diff}</div>
				</div>
				)
			}
			)}
		</div>
	)
}

export default HomePage;