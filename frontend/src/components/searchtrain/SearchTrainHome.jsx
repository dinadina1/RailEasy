import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { clearStationError } from '../../slices/stationSlice';
import { getAllStations } from '../../actions/stationAction';

const SearchTrainHome = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { error, stations } = useSelector(state => state.stationState);
    const [fromStationList, setFromStationList] = useState([]);
    const [toStationList, setToStationList] = useState([]);
    const [fromStation, setFromStation] = useState(null);
    const [toStation, setToStation] = useState(null);
    const [date, setDate] = useState(null);
    const [classname, setClassname] = useState(null);
    const [category, setCategory] = useState(null);

    // function to handle change in from station
    const handleFromStationList = (e) => {
        const searchValue = e.target.value.toLowerCase();

        if (searchValue) {
            const filteredStations = stations.filter(station => station.name.toLowerCase().includes(searchValue));
            setFromStationList(filteredStations);
        } else {
            setFromStationList([]);
        }
    }
    // function to handle change in to station
    const handleToStationList = (e) => {
        const searchValue = e.target.value.toLowerCase();

        if (searchValue) {
            const filteredStations = stations.filter(station => station.name.toLowerCase().includes(searchValue));
            setToStationList(filteredStations);
        } else {
            setToStationList([]);
        }
    }

    // function to set fromStation
    const handleFromStation = (station) => {
        setFromStation(station.name);
        document.getElementById('from_station').value = station.name;
        setFromStationList([]);
    }
    // function to set toStation
    const handleToStation = (station) => {
        setToStation(station.name);
        document.getElementById('to_station').value = station.name;
        setToStationList([]);
    }

    // function to swap station field
    const swapStationField = () => {
        const tempFromStation = fromStation;
        const tempToStation = toStation;

        setFromStation(tempToStation);
        setToStation(tempFromStation);

        document.getElementById('from_station').value = tempToStation;
        document.getElementById('to_station').value = tempFromStation;
    }

    useEffect(() => {
        dispatch(getAllStations)
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'top-center',
                style: {
                    background: '#FF4C4C',
                    color: '#fff'
                }
            });
            dispatch(clearStationError());
        }
    }, [error])

    // function to search
    const handleSearch = () => {
        if (fromStation && toStation && date && classname && category) {
            navigate(`/search?from=${fromStation}&to=${toStation}&date=${date}&class=${classname}&category=${category}`);
        } else {
            toast.error('Please fill all the fields');
        }
    }

    return (
        <div className="bg-white pt-8 border h-80">
            <form className="p-2 md:p-2 lg:p-4">
                <section
                    className="flex flex-col gap-3 md:gap-0 md:flex-row relative md:border-2 border-gray-300 lg:p-2">
                    <div>
                        <article className="flex flex-col md:p-3 ">
                            <label htmlFor="from_station" className="text-gray-500 text-sm font-semibold">From</label>
                            <input type="search" id="from_station"
                                onChange={handleFromStationList}
                                className=" w-full border-b-2 border-gray-400 text-md md:text-lg text-gray-700 font-semibold  md:font-bold h-10 outline-none focus:border-t-transparent focus:border-gray-900 "
                                placeholder="Enter from station" />
                        </article>
                        {/* show station list */}
                        {
                            fromStationList.length > 0 && (
                                <ul
                                    className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                                    {
                                        fromStationList.map(station => (
                                            <li key={station._id} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white" onClick={() => handleFromStation(station)}>{station.name} - {station.station_code}</li>
                                        ))
                                    }
                                </ul>
                            )
                        }
                    </div>

                    <div onClick={swapStationField} className="hidden md:block border-2 rounded-full my-auto p-2 me-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            strokeWidth="1.5" stroke="currentColor" className="size-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                    </div>
                    <div>
                        <article className="flex flex-col md:p-3">
                            <label htmlFor="to_station" className="text-gray-500 text-sm font-semibold">To</label>
                            <input type="search" id="to_station"
                                onChange={handleToStationList}
                                className=" w-full border-b-2 border-gray-400 text-md md:text-lg text-gray-700 font-semibold  md:font-bold h-10 outline-none focus:border-t-transparent focus:border-gray-900 "
                                placeholder="Enter destination station" />
                        </article>
                        {/* show station list */}
                        {
                            toStationList.length > 0 && (
                                <ul
                                    className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                                    {
                                        toStationList.map(station => (
                                            <li key={station._id} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white" onClick={() => handleToStation(station)}>{station.name} - {station.station_code}</li>
                                        ))
                                    }
                                </ul>
                            )
                        }
                    </div>
                    <article className="flex flex-col md:p-3 w-full md:w-1/5">
                        <label htmlFor="date" className="text-gray-500 text-sm font-semibold">Date</label>
                        <input type="date" id="to_station"
                            onChange={(e) => setDate(e.target.value)}
                            className=" w-full border-b-2 border-gray-400 text-md md:text-lg text-gray-700 font-semibold  md:font-bold h-10 outline-none focus:border-t-transparent focus:border-gray-900 " />
                    </article>
                    <article className="flex flex-col md:p-3 w-full md:w-1/5">
                        <label htmlFor="className" className="text-gray-500 text-sm font-semibold">class</label>
                        <select id="className"
                            onChange={(e) => setClassname(e.target.value)}
                            className=" w-full border-b-2 border-gray-400 text-md md:text-lg text-gray-700 font-semibold  md:font-bold h-10 outline-none focus:border-t-transparent focus:border-gray-900 ">
                            <option value="" defaultValue>--Select class--</option>
                            <option value="3ac">AC-3 Tier</option>
                            <option value="2ac">AC-2 Tier</option>
                            <option value="sleeper">Sleeper</option>
                            <option value="second class">Second class</option>
                        </select>
                    </article>
                    <article className="flex flex-col md:p-3 w-full md:w-1/5">
                        <label htmlFor="category" className="text-gray-500 text-sm font-semibold">Category</label>
                        <select id="category"
                            onChange={(e) => setCategory(e.target.value)}
                            className=" w-full border-b-2 border-gray-400 text-md md:text-lg text-gray-700 font-semibold  md:font-bold h-10 outline-none focus:border-t-transparent focus:border-gray-900 ">
                            <option value="" defaultValue>--Select Category--</option>
                            <option value="general">General</option>
                            <option value="ladies">Ladies</option>
                        </select>
                    </article>

                </section>
            </form>

            <div className="text-center md:text-end p-2 pe-5">
                <button onClick={handleSearch}
                    className="bg-gray-900 text-white px-8 py-2 md:py-3 rounded text-md font-semibold">Search</button>
            </div>
        </div>
    )
}

export default SearchTrainHome