import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../../layout/MetaData';
import Loader from '../../layout/Loader';
import AdminSidebar from '../../layout/AdminSidebar';
import { getAllTrains } from '../../../actions/trainAction';
import { useNavigate } from 'react-router-dom';

const TrainsSchedule = ({ setBgImage }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, user } = useSelector(state => state.authState);
    const { trains } = useSelector(state => state.trainState);

    const [trainList, setTrainList] = useState([]);

    // function to navigate view details
    const viewTrainDetails = (id) => {
        return navigate(`/admin/train/${id}`);
    }

    useEffect(() => {
        // Helper function to convert "HH:mm" to minutes since midnight
        const convertTimeToMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

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
    }, [trains]);

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getAllTrains);
    }, [dispatch]);

    return (
        <>
            <MetaData title={"Trains Schedule"} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        <div className="w-full lg:w-5/6 mx-auto bg-white p-2 md:p-8 rounded-lg shadow-md">

                            <div className=" w-full bg-blue-950 p-3 text-center mb-8 text-white px-6">
                                <h2 className="text-xl font-bold ">Upcoming Train Schedule</h2>
                            </div>
                            <div className="w-full overflow-auto ">
                                <table className="border bg-white rounded">
                                    <thead>
                                        <tr className="w-full bg-blue-950 text-white uppercase text-sm leading-normal">
                                            <th className="py-2 md:py-3 px-1 md:px-5 text-left">Train Name</th>
                                            <th className="py-2 md:py-3 px-1 md:px-5 text-left">Train Number</th>
                                            <th className="py-2 md:py-3 px-1 md:px-5 text-left">Source</th>
                                            <th className="py-2 md:py-3 px-1 md:px-5 text-left">Destination</th>
                                            <th className="py-2 md:py-3 px-1 md:px-5 text-left">Departure</th>
                                            <th className="py-2 md:py-3 px-1 md:px-5 text-left">Arrival</th>
                                            {/* <th className="py-2 md:py-3 px-1 md:px-5 text-left">Status</th> */}
                                            <th className="py-2 md:py-3 px-1 md:px-5 text-left">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700 text-sm font-light">
                                        {
                                            trainList.length > 0 ? (
                                                <>
                                                    {
                                                        trainList.map((train, index) => {
                                                            return <tr key={index} className="border-b border-gray-200 font-semibold hover:bg-gray-100">
                                                                <td className="py-2 md:py-2 px-1 md:px-5 text-left whitespace-nowrap">
                                                                    <span>{train?.name}</span>
                                                                </td>
                                                                <td className="py-2 md:py-2 px-1 md:px-5 text-left">
                                                                    <span>{train?.train_number}</span>
                                                                </td>
                                                                <td className="py-2 md:py-2 px-1 md:px-5 text-left">
                                                                    <span>{train?.source_station?.name}</span>
                                                                </td>
                                                                <td className="py-2 md:py-2 px-1 md:px-5 text-left">
                                                                    <span>{train?.destination_station?.name}</span>
                                                                </td>
                                                                <td className="py-2 md:py-2 px-1 md:px-5 text-left">
                                                                    <span>{train?.route[0]?.departure_time}</span>
                                                                </td>
                                                                <td className="py-2 md:py-2 px-1 md:px-5 text-left">
                                                                    <span>{train?.route[train.route.length - 1]?.arrival_time}</span>
                                                                </td>
                                                                {/* <td className="py-2 md:py-2 px-1 md:px-5 text-left">
                                                                    <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">On
                                                                        Time</span>
                                                                </td> */}
                                                                <td className="py-2 md:py-2 px-1 md:px-5 text-left">
                                                                    <button type='button' onClick={() => viewTrainDetails(train._id)}
                                                                        className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-full text-xs shadow hover:bg-blue-600 transition duration-300">View
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        })
                                                    }
                                                </>
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className='p-5 font-bold text-center text-gray-600'>Trains not found</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </main>
                )
            }
        </>
    )
}

export default TrainsSchedule