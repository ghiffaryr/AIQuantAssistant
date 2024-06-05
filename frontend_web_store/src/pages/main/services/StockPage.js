import HeaderTitleComponent from "../../../components/basic/HeaderTitleComponent";
import StockList from "../../../components/stock/StockList";
import { Container } from "react-bootstrap";
import StockCodeSearch from "../../../components/stock/StockCodeSearch";
import StockStatistics from "../../../components/stock/StockStatistics";
import { StockChart } from "../../../components/stock/StockChart";
import axios from "axios";
import { SCRAPPER_API } from "../../../env/Constants";
import { useEffect, useState } from "react";

export const sData = {
    "date_list": [
        "6/30/2023",
        "9/30/2023",
        "12/31/2023",
        "3/31/2024"
    ],
    "eps_actual_list": [
        "1.17",
        "1.35",
        "2.02",
        "1.42"
    ]
}

export const statisticData = {
    "date_list": [
        "Current",
        "3/31/2024",
        "12/31/2023",
        "9/30/2023",
        "6/30/2023",
        "3/31/2023"
    ],
    "market_cap_list": [
        "2.95T",
        "2.65T",
        "2.99T",
        "2.68T",
        "3.05T",
        "2.61T"
    ],
    "trailing_pe_list": [
        "29.90",
        "26.67",
        "31.41",
        "28.73",
        "32.88",
        "28.00"
    ],
    "price_per_book_list": [
        "39.73",
        "35.49",
        "47.90",
        "44.17",
        "49.08",
        "45.99"
    ],
    "diluted_eps": "6.42",
    "avg_volume_3month": "62.56M",
    "trailing_annual_dividend_yield": "0.50%",
    "total_debt_to_equity": "140.97%",
    "one_year_high": "199.62",
    "one_year_low": "164.08"
}

export default function StockPage() {
    const [topGainer, setTopGainer] = useState([])
    const [lowGainer, setLowGainer] = useState([])
    const [isLoading, setIsLoading] = useState([...Array(2)].fill(false))
    const [stockData, setStockData] = useState({})
    
    const getTopGainer = async() => {
        try {
            let {status, data} = await axios.get(`${SCRAPPER_API}/scrapper/stock/gainers`)
            const result = []
            for(const x in Array.from(Array(5).keys())) {
                result.push({
                    name: data[x]['Symbol'],
                    value: data[x]['% Change']
                })
            }
            setIsLoading((val) => {
                val[0] = true
                return val
            })

            setTopGainer(result)
        } catch(err) {
            alert(err)
        }
    }

    const getLowGainer = async() => {
        try {
            let {status, data} = await axios.get(`${SCRAPPER_API}/scrapper/stock/losers`)
            const result = []
            for(const x in Array.from(Array(5).keys())) {
                result.push({
                    name: data[x]['Symbol'],
                    value: data[x]['% Change']
                })
            }
            setIsLoading((val) => {
                val[val.length-1] = true
                return val
            })

            setLowGainer(result)
        } catch(err) {
            alert(err)
        }
    }

    const getStockStatistics = () => {
        setStockData({
            x: sData["date_list"],
            y: sData["eps_actual_list"]
        })

        console.log(stockData)
    }

    useEffect(() => {
        getTopGainer()
        getLowGainer()
        getStockStatistics()
    }, [])

    const statData = (() => ({
            marketCap: statisticData["market_cap_list"][0],
            priceEarnings: statisticData["trailing_pe_list"][0],
            dividendYield: statisticData["trailing_annual_dividend_yield"],
            averageVolume: statisticData["avg_volume_3month"],
            earnigsPerShare: statisticData["diluted_eps"],
            yearHigh: statisticData["one_year_high"],
            yearLow: statisticData["one_year_low"],
            pricePerBook: statisticData["price_per_book_list"][0],
            debtToEquity: statisticData["total_debt_to_equity"]
        })
    )()

    console.log(statData)
    
    return (
        <>
            <>
                <HeaderTitleComponent 
                  title={"Stocks"} 
                  divider={true}
                />
                <Container>
                    <StockList topGainers={topGainer} lowGainers={lowGainer}/>
                    {isLoading.every(val => val) && 
                         <div className="d-flex flex-column align-items-center">
                            <p className="fs-5 fw-bold">Pick stock code to analyze</p>
                            <StockCodeSearch />
                        </div>
                    }
                    <div className="d-flex justify-content-center pt-5 pb-5">
                        <StockStatistics 
                            className="vw-100"
                            title="Stock Statistic of APPL (Apple)"
                            data={statData}
                        />
                    </div>
                    
                    <StockChart  cData={stockData} title="Earnings per Share"/>
                </Container>
            </>
        </>
    )
};