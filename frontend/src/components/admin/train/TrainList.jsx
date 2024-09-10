import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../../layout/MetaData';
import Loader from '../../layout/Loader';
import AdminSidebar from '../../layout/AdminSidebar';
import { getAllTrains, deleteParticularTrain } from '../../../actions/trainAction';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { clearIsTrainDeleted } from '../../../slices/trainSlice';

const TrainList = ({ setBgImage }) => {

    const dispatch = useDispatch();
    const { loading, user } = useSelector(state => state.authState);
    const { trains = [], isDeleted = false, loading: trainLoading } = useSelector(state => state.trainState);

    const [trainList, setTrainList] = useState(trains);
    const [sort, setSort] = useState(null);

    // function to delete train
    const deleteTrain = (id) => {
        dispatch(deleteParticularTrain(id));
    }

    // function to search train name
    const searchTrain = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredTrains = trains.filter(train => train.name.toLowerCase().includes(searchValue));
        setTrainList(filteredTrains);
    }

    useEffect(() => {
        // Helper function to convert "HH:mm" to minutes since midnight
        const convertTimeToMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        if (sort === "departure") {
            // Sort by departure time in ascending order, then by train name alphabetically
            const sortedTrains = [...trains].sort((a, b) => {
                const departureTimeA = convertTimeToMinutes(a.route[0].departure_time);
                const departureTimeB = convertTimeToMinutes(b.route[0].departure_time);

                if (departureTimeA !== departureTimeB) {
                    return departureTimeA - departureTimeB; // Sort by departure time in minutes
                } else {
                    return a.train_number - b.train_number; // If times are the same, sort by train name alphabetically
                }
            });
            setTrainList(sortedTrains);
        }
        if (sort === "arrival") {
            const sortedTrains = [...trains].sort((a, b) => {
                const arrivalTimeA = convertTimeToMinutes(a.route[0].arrival_time);
                const arrivalTimeB = convertTimeToMinutes(b.route[0].arrival_time);

                if (arrivalTimeA !== arrivalTimeB) {
                    return arrivalTimeA - arrivalTimeB; // Sort by departure time in minutes
                } else {
                    return a.train_number - b.train_number; // If times are the same, sort by train name alphabetically
                }
            });
            setTrainList(sortedTrains);
        }
    }, [sort]);

    useEffect(() => {
        if (isDeleted) {
            toast.success('Train deleted success');
            dispatch(clearIsTrainDeleted());
        }
        setTrainList(trains)
        setSort("departure")
    }, [isDeleted, trains]);

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getAllTrains);
    }, [isDeleted]);

    return (
        <>
            <MetaData title={"Train List"} />
            {
                loading || trainLoading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        {/* <!-- main content --> */}
                        <div className="w-full md:w-5/6 mx-auto bg-white p-2 md:p-8 rounded-lg shadow-md">

                            <div className=" w-full bg-blue-950 p-3 text-center mb-8 text-white px-6">
                                <h2 className="text-xl font-bold ">Train List</h2>
                            </div>
                            <div className="container mx-auto p-4">
                                {/* <!-- Filter and Sorting Options --> */}
                                <div className="flex justify-between mb-4 flex-wrap gap-3">
                                    <input type="search" placeholder="Search by Train Name " onChange={searchTrain}
                                        className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />
                                    <select value={sort} onChange={(e) => setSort(e.target.value)}
                                        className="ml-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500">
                                        <option value="departure">Sort by Departure Time</option>
                                        <option value="arrival">Sort by Arrival Time</option>
                                    </select>
                                </div>

                                <p className='text-gray-600 font-semibold p-2'>{trainList?.length} results found.</p>

                                {/* <!-- Train Details Table --> */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                                        <thead>
                                            <tr className="bg-blue-950 text-white uppercase text-sm leading-normal">
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">Train Name</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">Train Number</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">From</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">To</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">Departure</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">Arrival</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">Duration</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">classNamees</th>
                                                <th className="py-2 md:py-3 px-2 md:px-4 text-left cursor-pointer">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600 text-sm font-semibold">
                                            {
                                                trainList.length > 0 && trainList.map((train, index) => (
                                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                                        <td className="py-2 md:py-3 px-2 md:px-4 text-left">
                                                            <Link to={`/admin/train/${train._id}`} className='hover:underline'>{train?.name}</Link>
                                                        </td>
                                                        <td className="py-2 md:py-3 px-2 md:px-4 text-left">{train?.train_number}</td>
                                                        <td className="py-2 md:py-3 px-2 md:px-4 text-left">{train?.source_station?.name}</td>
                                                        <td className="py-2 md:py-3 px-2 md:px-4 text-left">{train?.destination_station?.name}</td>
                                                        <td className="py-2 md:py-3 px-2 md:px-4 text-left">{train?.route[index]?.departure_time}</td>
                                                        <td className="py-2 md:py-3 px-2 md:px-4 text-left">{train?.route[index]?.arrival_time}</td>
                                                        <td className="py-2 md:py-3 px-2 md:px-4 text-left">{train?.route[index]?.journey_duration}</td>
                                                        {
                                                            train?.class.length > 0 && train.class.map((cls, index) => (
                                                                <span key={index} className='mx-0.5'>
                                                                    {cls?.name}
                                                                    {index < train.class.length - 1 && ","}
                                                                </span>
                                                            ))
                                                        }
                                                        <td className="py-2 md:py-3 px-2 md:px-4 text-left">
                                                            <Link onClick={() => deleteTrain(train._id)} className="bg-red-500 text-white hover:bg-red-600 cursor-pointer rounded-xl px-2 py-1 mx-0.5">Delete</Link>
                                                            <Link to={`/admin/train/edit/${train._id}`} className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer rounded-xl px-2 py-1 mx-0.5">Edit</Link>
                                                        </td>
                                                    </tr>
                                                ))
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

export default TrainList