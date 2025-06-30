import CommonHeader from '../components/commonHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendDown, faArrowTrendUp, faCartArrowDown, faCheck, faChevronDown, faChevronUp, faHandHoldingDollar, faTag, faUsers } from '@fortawesome/free-solid-svg-icons'
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell, XAxis, YAxis, CartesianGrid, Bar, Line, ComposedChart } from 'recharts';
import { useContext, useEffect, useMemo, useState } from 'react';
import ProductService from '../services/components/productService';
import { AppContext } from '../context';
import { requestForToken } from '../firebase-config';
import { Buffer } from 'buffer';
import CommonLoader from '../components/commonLoading';


export default function DashBoard() {

    const [isLoading, setIsLoading] = useState(false)

    const { storeId, userDetails } = useContext(AppContext)

    const [dashboardDetails, setDashboardDetails] = useState<any>(null)

    const [salesGraph, setSalesGraph] = useState<any>([])

    const [loginHistory, setLoginHistory] = useState<any>([])

    const [saleMonth, setSaleMonth] = useState([
        {
            id: '1', name: 'Last 12 Months', key: 'FULL_YEAR', selected: true
        },
        {
            id: '2', name: 'Last 6 Months', key: 'HALF', selected: false
        },
        {
            id: '3', name: 'Last 3 Months', key: 'QUARTER', selected: false
        }
    ])

    const [openFilter, setOpenFilter] = useState(false)

    const getDashBoardDetails = async () => {
        try {
            const res = await ProductService.getDashboardInfo(storeId);
            if (res) {
                setDashboardDetails(res);
                await getSalesPieDetails()
                await getSalesGraphDetails('FULL_YEAR')
                return res; // ✅ Return the data
            }
        } catch (error) {
            console.log("error in getDashboardInfo-->", error);
            throw error;
        }
    };

    const getSalesGraphDetails = async (monthType: string, isReport?: boolean) => {
        try {
            const data = isReport ? { type: monthType, isReport: 'true' } : { type: monthType };
            const res: any = await ProductService.getGraphDetails(storeId, data);
            if (res) {
                setSalesGraph(res?.data);
                if (isReport) {
                    downloadPdf(res?.response?.data, res?.fileName)
                }
            }
        } catch (error) {
            console.log("error in getSalesGraphDetails-->", error);
            throw error;
        }
    };

    const getSalesPieDetails = async () => {
        try {
            const res: any = await ProductService.getPieDetails(storeId);
            if (res?.data) {

                setLoginHistory(res?.data);
                setIsLoading(false)
            }
        } catch (error) {
            console.log("error in getSalesPieDetails", error);
            throw error;
        }
    };

    const downloadPdf = (bufferRes: any, name: string) => {
        const bufferData = bufferRes;
        const base64Data = Buffer.from(bufferData).toString('base64');
        const fileName = name; // or whatever the extension is

        // Create a data URI
        const dataUri = `data:application/pdf;base64,${base64Data}`;

        // Create a temporary download link
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }

    useEffect(() => {
        setIsLoading(true)
        getDashBoardDetails()
    }, [])

    const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];


    const data = [
        { name: '0-30%', count: 30, },
        { name: '30-70%', count: 40, },
        { name: '70-100%', count: 30, },
    ];


    const selectedMonth = useMemo(() => {
        return saleMonth.find((i) => i.selected)?.name || ''
    }, [saleMonth])


    const CustomComponent = () => {
        return (
            <div className='flex'>
                <div className='flex text-xl font-bold text-amber-500 px-5 capitalize'>
                    <p>{userDetails?.storeName}</p>
                </div>

            </div>
        )
    }

    return (
        <div className='w-full h-screen overflow-x-hidden'>
            <CommonHeader
                name='Dashboard'
                isAddEnable={true}
                isCustom
                CustomComponent={CustomComponent}
                onClickButton={() => {
                    requestForToken()
                }} />
            {isLoading ?
                <div className='flex justify-center h-screen items-center'>
                    <CommonLoader size='large' />
                </div>
                :
                <>
                    <div
                        className="flex flex-col sm:flex-row mx-4 my-3 bg-white p-4 rounded-2xl justify-between"                >
                        <div className='w-full sm:w-[24%] rounded-2xl grid gap-2 py-3 px-4 ' style={{ backgroundColor: '#F8F7FE' }}>
                            <FontAwesomeIcon icon={faTag} style={{ color: 'white', backgroundColor: '#ab91f5' }} className='text-2xl text-primary px-3 py-1 rounded-4xl' />
                            <p className='text-black font-medium text-xl'>Total Sales</p>
                            <p className='text-3xl font-bold text-black'>{`₹ ${dashboardDetails?.sale?.monthSale}`}</p>
                            <div className='flex justify-center items-center'>
                                <FontAwesomeIcon icon={dashboardDetails?.sale?.percentage > 0 ? faArrowTrendUp : faArrowTrendDown} className={`${dashboardDetails?.sale?.percentage > 0 ? 'text-green-500' : 'text-red-600'}`} />
                                <p className='px-3 font-medium text-black text-[13px]'>{`${Math.abs(dashboardDetails?.sale?.percentage)} % Than Last Month`}</p>
                            </div>
                        </div>
                        <div className='w-full sm:w-[24%] rounded-2xl grid gap-2 py-3 px-4 my-3 ms:my-0' style={{ backgroundColor: '#F8F7FE' }}>
                            <FontAwesomeIcon icon={faCartArrowDown} style={{ color: 'white', backgroundColor: '#7f8afe' }} className='text-2xl text-primary px-3 py-1 rounded-4xl' />
                            <p className='text-black font-medium text-xl'>Total Products</p>
                            <p className='text-3xl font-bold text-black'>{dashboardDetails?.products?.count}</p>
                            <div className='flex justify-center items-center'>
                                {dashboardDetails?.products?.productCross != 0 && <FontAwesomeIcon icon={faArrowTrendUp} className={`${dashboardDetails?.product?.productCross > 0 ? 'text-green-500' : 'text-red-600'}`} />
                                }
                                {dashboardDetails?.products?.productCross == 0 ? <p className='px-3 font-medium text-yellow-400'>{`Restock the product`}</p>
                                    : <p className='px-3 font-medium text-black'>{`${dashboardDetails?.products?.productCross}`}</p>}
                            </div>
                        </div>

                        <div className='w-full sm:w-[24%] rounded-2xl grid gap-2 py-3 px-4' style={{ backgroundColor: '#F8F7FE' }}>
                            <FontAwesomeIcon icon={faUsers} style={{ color: 'white', backgroundColor: '#3F9BC0' }} className='text-2xl text-primary px-3 py-1 rounded-4xl' />
                            <p className='text-black font-medium text-xl'>Total Staff</p>
                            <p className='text-3xl font-bold text-black'>{dashboardDetails?.staff?.totalStaff}</p>
                            <div className='flex justify-between px-3' >
                                <p className='text-2xl font-bold text-green-800'>{`P - ${dashboardDetails?.staff?.present}`}</p>
                                <p className='text-2xl font-bold text-red-600'>{`AB - ${dashboardDetails?.staff?.absent}`}</p>
                            </div>
                            <div className='flex justify-center items-center'>
                                <FontAwesomeIcon icon={faArrowTrendUp} className={`${dashboardDetails?.staff?.salaryCross > 0 ? 'text-green-500' : 'text-red-600'}`} />
                                <p className='px-3 font-medium text-black text-[13px]' >{`${Math.abs(dashboardDetails?.staff?.salaryCross)} % Than Last Month`}</p>
                            </div>
                        </div>
                        <div className='w-full sm:w-[24%] rounded-2xl grid gap-2 py-3 px-4 my-3 ms:my-0' style={{ backgroundColor: '#F8F7FE' }}>
                            <FontAwesomeIcon icon={faHandHoldingDollar} style={{ color: 'white', backgroundColor: '#C7D96C' }} className='text-2xl text-primary px-3 py-1 rounded-4xl' />
                            <p className='text-black font-medium text-xl'>Today Sale</p>
                            <p className='text-3xl font-bold text-black'>{`₹ ${dashboardDetails?.sale?.todaySale}`}</p>
                            <div>
                                <p className='text-xl font-bold text-black'>{` Monthly Sale: ₹ ${dashboardDetails?.sale?.monthSale}`}</p>
                            </div>

                        </div>

                    </div>

                    <div className=' rounded-2xl sm:flex-row flex flex-col justify-between items-center px-4 '>


                        {salesGraph.length > 0 ? <div className='sm:w-[70%] w-full flex-col justify-center items-center  bg-white sm:my-0 my-2 rounded-xl h-[400px] px-2' >

                            <div className='flex h-[50px] my-2 items-center px-2 justify-between relative'>
                                <div >
                                    <p className='text-gray-700 font-bold '>Sales Report</p>
                                </div>
                                <button onClick={() => {
                                    setOpenFilter(!openFilter)
                                }
                                } className='bg-gray-100 px-2 py-3 rounded-[7px] flex justify-between items-center'>
                                    <p className='text-black capitalize font-bold text-[14px]'>{selectedMonth}</p>
                                    <FontAwesomeIcon icon={openFilter ? faChevronUp : faChevronDown} className='px-2 text-[13px] text-black' />
                                </button>
                                <div className={`${openFilter ? 'max-h-40 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}
                         transition-all duration-500 ease-in-out flex absolute bg-gray-100 right-2 w-[150px] mt-41  flex-col rounded-[7px] z-10`}>
                                    {
                                        saleMonth.map((item, index) =>
                                        (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setSaleMonth((prev) => {
                                                        return prev.map((i) => ({
                                                            ...i,
                                                            selected: item.id == i.id
                                                        }))
                                                    })
                                                    getSalesGraphDetails(item.key, false)
                                                    setOpenFilter(false)
                                                }
                                                } className=' mx-1 my-2  flex px-2 items-center justify-between'>
                                                <p className={`text-[14px] ${item.selected ? 'text-primary font-bold' : 'text-black font-medium'}`}>{item.name}</p>

                                                {item.selected && <FontAwesomeIcon icon={faCheck} className='text-[14px] text-primary' />
                                                }
                                            </button>
                                        ))
                                    }
                                </div>
                            </div>

                            <ResponsiveContainer width="95%" height={355} >
                                <ComposedChart
                                    width={500}
                                    height={400}
                                    data={salesGraph}
                                    margin={{
                                        top: 20,
                                        bottom: 30,
                                        left: 40,
                                    }}
                                >
                                    <CartesianGrid stroke="#fff" />
                                    <XAxis dataKey="month" scale="band" />
                                    <YAxis />
                                    <Tooltip contentStyle={{ height: 100, justifyContent: 'center', alignItems: 'center' }} />
                                    <Legend />
                                    <Bar dataKey="totalSales" barSize={20} fill="#AF98F0" />
                                    <Line type="monotone" dataKey="year" stroke="#FB615C" />
                                </ComposedChart>
                            </ResponsiveContainer>

                        </div> : null}

                        {loginHistory.length > 0 && <div className='roundex-2xl sm:w-[29%] w-full py-2 bg-white rounded-xl h-[400px]'>
                            <h3 className='text-gray-700 font-bold px-3 py-2'>Devices</h3>
                            <ResponsiveContainer width={'100%'} height={350} >
                                <PieChart>
                                    <Pie
                                        data={loginHistory}
                                        dataKey='count'
                                        nameKey="deviceName"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {data.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>}

                    </div>

                    <div className='sm:flex-row flex  flex-col justify-between px-2 '>
                        {dashboardDetails?.products?.newlyadded && <div className='sm:w-[69%] w-[95%] bg-white mx-2 my-4 sm:overflow-hidden overflow-x-scroll rounded-[10px]  max-h-[400px] overflow-y-auto ' >
                            <div className='text-black capitalize font-bold text-[15px] px-5 py-4 flex justify-between items-center'>
                                <p>Recently Added Products</p>
                                <p className='text-gray-400'>Current Month</p>
                            </div>
                            <table className="table-auto w-[100%] rounded-2xl py-5 px-4">
                                {/* header of the table */}
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 text-[14px]">
                                        <th className="w-[20%] p-2">S.No</th>
                                        <th className="w-[25%] p-2">Name</th>
                                        <th className="w-[25%] p-2">Qunatity</th>
                                        <th className="w-[25%] p-2">Price</th>
                                        <th className="w-[25%] p-2">PurchasedDate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dashboardDetails?.products?.newlyadded?.map((item: any, index: number) =>
                                        (
                                            <tr key={index} className='border-b-2 border-gray-200 bg-white text-gray-500 font-medium capitalize text-center text-[13px]'>
                                                <td className="w-[20%] p-2">{index + 1}</td>
                                                <td className="w-[25%] p-2">{item?.name}</td>
                                                <td className="w-[25%] p-2">{item?.quantity}</td>
                                                <td className="w-[25%] p-2">{item?.price}</td>
                                                <td className="w-[25%] p-2">{item?.createdAt}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>}

                        {dashboardDetails?.products?.count && <div className='bg-white sm:w-[29%] w-[95%] rounded-[7px] my-4 mx-2 px-2 py-2'>
                            <div className='text-black capitalize font-bold text-[15px] px-5 py-4 flex justify-between items-center'>
                                <p>Stock History</p>
                                <p className='text-gray-400'>Current Month</p>
                            </div>
                            <div className='px-3 py-2 rounded-[14px]' style={{ backgroundColor: '#F8F7FE' }}>
                                <p className='text-black font-medium text-xl'>Total Products</p>
                                <p className='text-3xl font-bold text-black'>{dashboardDetails?.products?.count}</p>
                            </div>
                            <div className='my-2 px-3 py-2 rounded-[14px]' style={{ backgroundColor: '#F8F7FE' }}>
                                <p className='text-black font-medium text-xl'>Newly Added</p>
                                <p className='text-3xl font-bold text-black'>{dashboardDetails?.products?.newlyadded?.length}</p>
                            </div>
                            <div className='px-3 py-2 rounded-[14px]' style={{ backgroundColor: '#F8F7FE' }}>
                                <p className='text-black font-medium text-xl'>Purchased price</p>
                                <p className='text-3xl font-bold text-green-500'>₹ {dashboardDetails?.products?.currentMonths}</p>
                            </div>
                        </div>}

                    </div>
                </>
            }






            {/* <div>
                <button popoverTarget="pop1" popoverTargetAction='show'>
                    Toggle Popover
                </button>

                <div id="pop1" popover="auto" className='w-full h-screen bg-transparent flex justify-center items-center' style={{ padding: '10px', border: '1px solid black', flex: 1, justifyContent: 'center' }}>
                    Hello from native popover!
                </div>
            </div> */}





        </div >
    )
}



