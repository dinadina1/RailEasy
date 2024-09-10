import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../../layout/MetaData';
import Loader from '../../layout/Loader';
import AdminSidebar from '../../layout/AdminSidebar';
import { Link } from 'react-router-dom';
import { deleteStationById, getAllStations } from '../../../actions/stationAction';
import toast from 'react-hot-toast';
import { clearIsStationDeleted, clearStationError } from '../../../slices/stationSlice';

const StationList = ({ setBgImage }) => {

    const dispatch = useDispatch();

    const { loading, user } = useSelector(state => state.authState);
    const { stations = [], isDeleted, error } = useSelector(state => state.stationState);

    const [stationList, setStationList] = useState(stations);

    // function to delete station
    const handleDelete = (id) => {
        dispatch(deleteStationById(id));
    };

    // function to filter stations by name or code
    const handleStationList = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredStations = stations.filter(station => station.name.toLowerCase().includes(searchValue) || station.station_code.toLowerCase().includes(searchValue));
        setStationList(filteredStations);
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearStationError());
        }
        if (isDeleted) {
            toast.success("Station deleted successfully");
            dispatch(clearIsStationDeleted());
            dispatch(getAllStations);
        }
        setStationList(stations);
    }, [error, isDeleted, stations]);

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getAllStations);
    }, []);

    return (
        <>
            <MetaData title={"Station list"} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        {/* <!-- main content --> */}
                        <div className="w-full lg:w-5/6 mx-auto bg-white p-1 md:p-8 rounded-lg shadow-md h-screen overflow-y-auto">

                            <div className=" w-full bg-blue-950 p-3 text-center mb-8 text-white px-6">
                                <h2 className="text-xl font-bold ">Station List</h2>
                            </div>
                            <div className="container mx-auto py-2">
                                {/* <!-- Filter and Sorting Options --> */}
                                <div className="flex justify-between mb-4 flex-wrap gap-3">
                                    <input type="search" placeholder="Search by Staion code or Number" onChange={handleStationList}
                                        className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />

                                </div>
                                <p className='text-gray-600 font-bold text-lg p-2'>{stationList.length} results found.</p>

                                {/* <!-- Train Details Table --> */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                                        <thead>
                                            <tr className="bg-blue-950 text-white uppercase text-sm leading-normal">
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer"> Code</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">Station Name</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">Platforms</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">City</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">state</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">country</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600 text-sm font-semibold">
                                            {/* <!-- Train Details Row --> */}
                                            {
                                                stationList?.length > 0 ? (
                                                    stationList?.map((station, index) => {
                                                        const platform = [];
                                                        for (let i = 1; i <= station?.total_platform; i++) {
                                                            platform.push(i);
                                                        }

                                                        return <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-left">{station?.station_code}</td>
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-left">
                                                                <Link className='hover:underline' to={`/admin/station/${station?._id}`}>{station?.name}</Link>
                                                            </td>
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-left">
                                                                {platform.toString()}
                                                            </td>
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-left">{station?.city}</td>
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-left">{station?.state}</td>
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-left">{station?.country}</td>
                                                            <td className="flex py-2 md:py-3 px-2 md:px-4 text-left">
                                                                <span onClick={() => handleDelete(station._id)} className='text-red-500 cursor-pointer hover:text-red-600 my-auto px-1'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-5">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                    </svg>

                                                                </span>
                                                                <Link to={`/admin/station/edit/${station?._id}`}
                                                                    className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs shadow hover:bg-blue-600 transition duration-300">Edit
                                                                </Link></td>
                                                        </tr>
                                                    })
                                                ) : (
                                                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                                                        <td colSpan={7} className="py-2 md:py-3 px-2 md:px-4 text-center p-2">No stations available</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </main>
                )
            }
        </>
    )
}

export default StationList