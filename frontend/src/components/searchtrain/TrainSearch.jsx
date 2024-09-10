import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getParticularTrain, searchTrains } from '../../actions/trainAction';
import Loader from "../layout/Loader";
import TrainCard from './TrainCard';
import { getAllStations } from '../../actions/stationAction';
import { toast } from "react-hot-toast"
import AdminSidebar from '../layout/AdminSidebar';
import MetaData from '../layout/MetaData';

const TrainSearch = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get query from URL
    let searchQuery = decodeURIComponent(location.search);

    const { loading = true, error = null, trains = [] } = useSelector(state => state.trainState);
    const { stations = [] } = useSelector(state => state.stationState);
    const { user } = useSelector(state => state.authState);

    const [from, setFrom] = useState(new URLSearchParams(location.search).get('from'));
    const [to, setTo] = useState(new URLSearchParams(location.search).get('to'));
    const [fromStationList, setFromStationList] = useState([]);
    const [toStationList, setToStationList] = useState([]);
    const [fromStation, setFromStation] = useState(from);
    const [toStation, setToStation] = useState(to);
    const [date, setDate] = useState(new URLSearchParams(location.search).get('date'));
    const [className, setclassName] = useState(new URLSearchParams(location.search).get('class'));
    const [category, setCategory] = useState(new URLSearchParams(location.search).get('category'));

    const [trainList, setTrainList] = useState(trains);
    const [train, setTrain] = useState(null);
    const [sort, setSort] = useState("departurefirst");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [route, setRoute] = useState([]);

    // Function to format date
    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            weekday: 'short'
        }).replace(',', '');

    // Function to handle changes in the "from station" input field
    const handleFromStationList = (e) => {
        const searchValue = e.target.value.toLowerCase();

        if (searchValue) {
            const filteredStations = stations.filter(station => station.name.toLowerCase().includes(searchValue));
            setFromStationList(filteredStations);
        } else {
            setFromStationList([]);
        }
    }

    // Function to handle changes in the "to station" input field
    const handleToStationList = (e) => {
        const searchValue = e.target.value.toLowerCase();

        if (searchValue) {
            const filteredStations = stations.filter(station => station.name.toLowerCase().includes(searchValue));
            setToStationList(filteredStations);
        } else {
            setToStationList([]);
        }
    }

    // Function to set the selected "from station"
    const handleFromStation = (station) => {
        setFromStation(station.name);
        setFromStationList([]);
    }

    // Function to set the selected "to station"
    const handleToStation = (station) => {
        setToStation(station.name);
        setToStationList([]);
    }

    // Function to swap the "from station" and "to station" fields
    const swapStationField = () => {
        const tempFromStation = fromStation;
        const tempToStation = toStation;

        setFromStation(tempToStation);
        setToStation(tempFromStation);
    }

    // Function to handle search
    const handleSearch = () => {
        if (fromStation && toStation && date && className && category) {
            dispatch(searchTrains(`?from=${fromStation}&to=${toStation}&date=${date}&className=${className}&category=${category}`));
            setFrom(fromStation);
            setTo(toStation);
        } else {
            toast.error("Please fill all the fields");
        }
    }

    // Function to open the sort train popup
    const sortTrainPopup = () => {
        setIsSortOpen(true);
        const popup = document.getElementById('popup');
        popup.classList.toggle("inset-0")
    }

    // update sort modal
    const updateSort = (sortValue) => {
        setSort(sortValue);
        setIsSortOpen(false);
        const popup = document.getElementById('popup');
        popup.classList.toggle("inset-0");
    }

    // function to change previous date
    const changeToPreviousDay = () => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() - 1);
        setDate(currentDate.toISOString().split('T')[0]);
    }

    // function to change next date
    const changeToNextDay = () => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + 1);
        setDate(currentDate.toISOString().split('T')[0]);

        const weekday = currentDate.toString().split(' ');

        const newList = trainList.filter((train) => {
            return train.day_of_operation.includes(weekday[0].toLowerCase());
        });
    }

    // function to select class
    const selectClass = (trainId, cls) => {
        let newTrainList = trainList.map((train) => {
            if (train._id.toString() === trainId.toString()) {
                let newClass = train.class.map((clas) => {
                    if (clas.name === cls) {
                        return { ...clas, selected: true };
                    }
                    return { ...clas, selected: false };
                });
                return { ...train, class: newClass };
            }
            return train;
        });
        setTrainList(newTrainList);
    };

    // function to show train schedule
    const showTrainSchedule = (trainId) => {
        // Find the selected train from the train list
        let train = trainList.find((ele) => ele._id === trainId);

        if (!train) {
            console.error("Train not found");
            return;
        }

        // Find the index of fromStation and toStation in the route
        const fromIndex = train.route.findIndex((routeStop) => routeStop.station.name.toLowerCase() === fromStation.toLowerCase());
        const toIndex = train.route.findIndex((routeStop) => routeStop.station.name.toLowerCase() === toStation.toLowerCase());

        // Check if fromStation exists before toStation in the route array
        let selectedRoute;
        if (fromIndex > toIndex) {
            selectedRoute = train.return_route;
        } else {
            selectedRoute = train.route;
        }

        // Update the train object with the selected route
        setTrain({ ...train, route: selectedRoute });

        // Toggle the schedule popup
        const popup = document.getElementById("train_schedule_popup");
        if (popup) {
            popup.classList.toggle("inset-0");
        } else {
            console.error("Popup element not found");
        }
    };


    // function to close train schedule
    const closeTrainSchedule = () => {
        setTrain(null);
        document.getElementById("train_schedule_popup").classList.toggle("inset-0");
    }

    // function to handle book ticket
    const handleBook = (data) => {
        let bookingData = data;
        bookingData.class = bookingData.train.class.find((ele) => ele.selected === true);
        if (!bookingData.class) {
            toast.error("Please select a class");
            return;
        }
        bookingData.user = user;
        bookingData.className = className;
        bookingData.category = category;

        localStorage.setItem("bookingData", JSON.stringify(bookingData));
        navigate('/ticket/book/passengers');
    }

    useEffect(() => {
        setTrainList(trains);
    }, [trains, sort])

    useEffect(() => {
        dispatch(searchTrains(searchQuery));
        setTrainList(trains);
        dispatch(getAllStations);
    }, [dispatch]);

    return (
        <>
            <MetaData title={"Search trains"} />
            {
                loading ? <Loader /> :

                    <main className='flex'>
                        {
                            user?.role === "admin" && <AdminSidebar />
                        }
                        <div className={user?.role === "admin" ? "container p-2 md:p-5 w-full lg:5/6 mx-auto h-screen overflow-y-auto" : "container p-2 md:p-5 w-full"}>
                            <section className="bg-gray-800 p-4 flex justify-between flex-wrap gap-2 lg:gap-0 py-8">
                                <div>
                                    <article className="my-auto flex w-full lg:w-auto bg-white">
                                        <span className="text-gray-800 my-auto p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentcolor" height="15" width="15">
                                                <path
                                                    d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8l176 0 0 176c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z" />
                                            </svg>
                                        </span>
                                        <input type="search" placeholder="From Station" id='fromStation' value={fromStation} onChange={e => {
                                            setFromStation(e.target.value);
                                            handleFromStationList(e);
                                        }} className="h-10 text-lg focus:outline-none p-1 text-gray-600 w-full" />
                                    </article>
                                    {/* from station list */}
                                    {fromStationList.length > 0 && (
                                        <ul
                                            className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                                            {fromStationList.map((station, index) => (
                                                <li key={index} onClick={() => handleFromStation(station)} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white">{station.name} - {station.station_code}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <article onClick={swapStationField} className="my-auto cursor-pointer text-white w-full lg:w-auto flex justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                        stroke="currentColor" className="size-6 ">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                    </svg>
                                </article>

                                <div>
                                    <article className="my-auto flex bg-white w-full lg:w-auto ">
                                        <span className="text-gray-800 my-auto p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentcolor" height="15" width="15">
                                                <path
                                                    d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                            </svg>
                                        </span>
                                        <input type="search" placeholder="To Station" id='toStation' value={toStation} onChange={e => {
                                            setToStation(e.target.value);
                                            handleToStationList(e);
                                        }} className="h-10 text-lg focus:outline-none p-1 text-gray-600 w-full" />
                                    </article>
                                    {/* to station list */}
                                    {toStationList.length > 0 && (
                                        <ul
                                            className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                                            {toStationList.map((station, index) => (
                                                <li key={index} onClick={() => handleToStation(station)} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white">{station.name} - {station.station_code}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <article className="my-auto w-full lg:w-auto ">
                                    <input type="date" placeholder="To Station" id='date' value={date} onChange={(e) => setDate(e.target.value)}
                                        className="h-10 w-full lg:w-auto text-lg focus:outline-none p-1 text-gray-600" />
                                </article>

                                <article className="my-auto flex bg-white w-full lg:w-auto ">
                                    <span className="text-gray-800 my-auto p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentcolor" height="15" width="15">
                                            <path
                                                d="M184 48l144 0c4.4 0 8 3.6 8 8l0 40L176 96l0-40c0-4.4 3.6-8 8-8zm-56 8l0 40L64 96C28.7 96 0 124.7 0 160l0 96 192 0 128 0 192 0 0-96c0-35.3-28.7-64-64-64l-64 0 0-40c0-30.9-25.1-56-56-56L184 0c-30.9 0-56 25.1-56 56zM512 288l-192 0 0 32c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-32L0 288 0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-128z" />
                                        </svg>
                                    </span>
                                    <select id='className' value={className} onChange={(e) => setclassName(e.target.value)} className="h-10 w-full lg:w-auto text-lg focus:outline-none p-1 text-gray-600">
                                        <option value="" defaultValue>--Select Class--</option>
                                        <option value="3ac">AC-3 Tier</option>
                                        <option value="2ac">AC-2 Tier</option>
                                        <option value="sleeper">Sleeper</option>
                                        <option value="second">Second Class</option>
                                    </select>
                                </article>

                                <article className="my-auto flex bg-white w-full lg:w-auto ">
                                    <span className="text-gray-800 my-auto p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentcolor" height="15" width="15">
                                            <path
                                                d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
                                        </svg>
                                    </span>
                                    <select id='category' value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 lg:w-auto text-lg focus:outline-none p-1 text-gray-600 w-full">
                                        <option value="" defaultValue>--Select Category--</option>
                                        <option value="general">General</option>
                                        <option value="ladies">Ladies</option>
                                    </select>
                                </article>

                                <article className="my-auto">
                                    <button onClick={handleSearch} className="bg-orange-600 text-white px-4 py-2 rounded">
                                        Modify Search
                                    </button>
                                </article>
                            </section>


                            <section className="bg-gray-100">
                                <p className="flex gap-2 p-3 ms-3 text-lg flex-wrap">
                                    <span>{trains.length}</span>
                                    results for <span className=" font-bold">{from}</span>
                                    <span className="text-gray my-auto"><svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    </span>
                                    <span className=" font-bold">{to}</span>
                                    <span className=" font-bold">{formatDate(date)}</span>
                                    For Quota |
                                    <span> General</span>
                                </p>

                                <div className="flex justify-between flex-wrap">
                                    <div className="flex flex-wrap gap-3 mx-6">
                                        <button onClick={sortTrainPopup} id="openPopupBtn" type="button"
                                            className="inline-flex justify-center px-6 py-2 text-sm font-medium text-white bg-blue-800 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500">
                                            Sort By | Duration
                                        </button>
                                        <button className="py-2 px-4 border bg-gray-200 border-gray-800 font-medium rounded">Show Available
                                            Trains</button>
                                    </div>
                                    <div className="flex flex-wrap gap-3 mx-6 ">
                                        <button onClick={changeToPreviousDay}
                                            className="py-2 px-4 border bg-gray-200  border-gray-800 rounded flex text-gray-600 font-bold">
                                            <span className="mx-auto my-auto me-2 ">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M15.75 19.5 8.25 12l7.5-7.5" />
                                                </svg>
                                            </span>
                                            Previous Day
                                        </button>
                                        <button onClick={changeToNextDay}
                                            className="py-2 px-4 border bg-gray-200  border-gray-800 rounded flex text-gray-600 font-bold">
                                            Next Day
                                            <span className="mx-auto my-auto ">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <section className="p-6">
                                    {/* <!-- booking card --> */}
                                    {
                                        trainList.length > 0 ? trainList.map((train, index) => {
                                            return <TrainCard key={index} train={train} fromStation={fromStation} toStation={toStation} date={date} selectClass={selectClass} showTrainSchedule={showTrainSchedule} handleBook={handleBook} />
                                        }) : (
                                            <p className='text-gray-800 text-center font-bold text-xl p-4'>No Trains found</p>
                                        )
                                    }
                                </section>
                            </section>

                            {/* <!--sortby duration model --> */}

                            {
                                isSortOpen && (
                                    <div id="popup" className="fixed flex items-center justify-center bg-gray-900 bg-opacity-50">
                                        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full flex flex-wrap ">
                                            <div className="p-1 w-1/2">
                                                <article
                                                    onClick={() => updateSort("durationfirst")}
                                                    className={sort === "durationfirst" ? "p-2 bg-gray-800 text-white border border-gray-500 text-center cursor-pointer" : "p-2 border border-gray-500 text-center cursor-pointer hover:bg-gray-300"}
                                                >
                                                    <p className="font-semibold">Duration</p>
                                                    <p className="text-sm font-semibold">Early First</p>
                                                </article>
                                            </div>
                                            <div className="p-1 w-1/2">
                                                <article
                                                    onClick={() => updateSort("durationlast")}
                                                    className={sort === "durationlast" ? "p-2 bg-gray-800 text-white border border-gray-500 text-center cursor-pointer" : "p-2 border border-gray-500 text-center cursor-pointer hover:bg-gray-300"}
                                                >
                                                    <p className="font-semibold">Duration</p>
                                                    <p className="text-sm font-semibold">Late First</p>
                                                </article>
                                            </div>
                                            <div className="p-1 w-1/2">
                                                <article
                                                    onClick={() => updateSort("departurefirst")}
                                                    className={sort === "departurefirst" ? "p-2 bg-gray-800 text-white border border-gray-500 text-center cursor-pointer" : "p-2 border border-gray-500 text-center cursor-pointer hover:bg-gray-300"}
                                                >
                                                    <p className="font-semibold">Departure</p>
                                                    <p className="text-sm font-semibold">Early First</p>
                                                </article>
                                            </div>
                                            <div className="p-1 w-1/2">
                                                <article
                                                    onClick={() => updateSort("departurelast")}
                                                    className={sort === "departurelast" ? "p-2 bg-gray-800 text-white border border-gray-500 text-center cursor-pointer" : "p-2 border border-gray-500 text-center cursor-pointer hover:bg-gray-300"}
                                                >
                                                    <p className="font-semibold">Departure</p>
                                                    <p className="text-sm font-semibold">Late First</p>
                                                </article>
                                            </div>
                                            <div className="p-1 w-1/2">
                                                <article
                                                    onClick={() => updateSort("arrivalfirst")}
                                                    className={sort === "arrivalfirst" ? "p-2 bg-gray-800 text-white border border-gray-500 text-center cursor-pointer" : "p-2 border border-gray-500 text-center cursor-pointer hover:bg-gray-300"}
                                                >
                                                    <p className="font-semibold">Arrival</p>
                                                    <p className="text-sm font-semibold">Early First</p>
                                                </article>
                                            </div>
                                            <div className="p-1 w-1/2">
                                                <article
                                                    onClick={() => updateSort("arrivallast")}
                                                    className={sort === "arrivallast" ? "p-2 bg-gray-800 text-white border border-gray-500 text-center cursor-pointer" : "p-2 border border-gray-500 text-center cursor-pointer hover:bg-gray-300"}
                                                >
                                                    <p className="font-semibold">Arrival</p>
                                                    <p className="text-sm font-semibold">Late First</p>
                                                </article>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            <br />
                            {/* <!-- Train schedule model --> */}
                            {
                                train && (
                                    <div id="train_schedule_popup"
                                        className="fixed inset-0 flex items-center justify-center bg-blue-950 bg-opacity-50 overflow-auto p-6">
                                        <div className="bg-white rounded shadow-lg max-w-6xl w-full h-auto max-h-screen flex flex-wrap overflow-y-auto">
                                            <div className="flex justify-between w-full bg-gray-800 p-4 text-white px-6">
                                                <h2 className="text-xl font-bold">Train Schedule</h2>
                                                <span id="close_train_schedule_popup" onClick={closeTrainSchedule} className="hover:cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentcolor" height="25" width="25">
                                                        <path
                                                            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                                    </svg>
                                                </span>
                                            </div>

                                            {/* train table */}
                                            <div className="p-4 w-full">
                                                <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-md">
                                                    <thead className="bg-gray-800 font-bold">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Train Number</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Train Name</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">From Station</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Destination Station</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Runs On</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        <tr>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{train?.train_number}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-9900">{train?.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train?.source_station?.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train?.destination_station?.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {train?.day_of_operation.length > 0 && train.day_of_operation.map((item, index) => (
                                                                    <span key={index} className="bg-green-400 rounded px-1 py-0.5 mx-0.5">{item.toUpperCase()}</span>
                                                                ))}
                                                                {train?.return_day_of_operation.length > 0 && train.return_day_of_operation.map((item, index) => (
                                                                    <span key={index} className="bg-green-400 rounded px-1 py-0.5 mx-0.5">{item.toUpperCase()}</span>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* train schedule table */}
                                            <div className="p-4 w-full overflow-y-auto max-h-96">
                                                <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-md">
                                                    <thead className="bg-gray-800">
                                                        <tr>
                                                            <th className="px-2 text-white py-5 text-center text-xs font-medium uppercase tracking-wider">S.N.</th>
                                                            <th className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">Station Code</th>
                                                            <th className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">Station Name</th>
                                                            <th className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">Route Number</th>
                                                            <th className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">Arrival Time</th>
                                                            <th className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">Departure Time</th>
                                                            <th className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">Halt Time(In minutes)</th>
                                                            <th className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">Distance</th>
                                                            <th className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">Day</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {train?.route.length > 0 && train?.route.map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.station?.station_code}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.station?.name}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.route_number}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.arrival_time === "00:00" ? "---" : item?.arrival_time}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.departure_time === "00:00" ? "---" : item?.departure_time}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.halt_time === "00:00" ? "---" : item?.halt_time}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.distance === "00:00" ? "---" : `${item?.distance}Km`}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.route_number}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                )
                            }
                        </div>
                    </main>
            }
        </>

    )
}

export default TrainSearch