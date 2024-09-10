import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../../layout/MetaData';
import Loader from '../../layout/Loader';
import AdminSidebar from '../../layout/AdminSidebar';
import { Link, useParams } from 'react-router-dom';
import { getStationById } from '../../../actions/stationAction';

const StaionDetail = ({ setBgImage }) => {

    const { id } = useParams();
    const dispatch = useDispatch();

    const { loading } = useSelector(state => state.authState);
    const { station } = useSelector(state => state.stationState);

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getStationById(id));
    }, [id]);

    const platform = [];
    for (let i = 1; i <= station?.total_platform; i++) {
        platform.push(i);
    }

    return (
        <>
            <MetaData title={`Station Details - ${id}`} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        {/* <!-- main content --> */}
                        <div className="w-full bg-white rounded-xl shadow-xl overflow-auto">
                            <div className="flex justify-between p-3">
                                {/* <!-- Back button --> */}
                                <Link to={"/admin/station/all"} className="max-w-sm p-3 flex text-blue-500 font-bold text-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 my-auto" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Go Back
                                </Link>
                            </div>

                            {/* <!-- Header --> */}
                            <div className="text-gray-800 p-2 md:p-8">
                                <h1 className="text-4xl font-bold">Station Details</h1>
                            </div>

                            {
                                station?._id && (
                                    <section className="p-2 md:p-6">
                                        {/* <!-- Train Overview --> */}
                                        <div className="flex justify-between mx-2 md:mx-8 ">
                                            <h3 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 ">{station?.name} - ({station?.station_code}) </h3>
                                            {/* <!-- Edit button --> */}
                                            <Link to={`/admin/station/edit/${station?._id}`}
                                                className="flex items-center bg-blue-600 text-white px-5 md:px-6 md:py-1 rounded-full shadow-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M5 13l4 4H4v-3l1-1h4l4 4h5l5-5L12 3l-7 7L4 7v6H1v4h3l4 4h8l5-5" />
                                                </svg>
                                                <span className="hidden md:block">Edit</span>
                                            </Link>
                                        </div>

                                        <div className="m-2 md:m-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50">

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-gray-700 p-1"><strong>Station Code:</strong> ({station?.station_code})</p>
                                                    <p className="text-gray-700 p-1"><strong>Station Name:</strong> {station?.name}</p>
                                                    <p className="text-gray-700 p-1"><strong>Platforms:</strong> {platform.toString()}</p>
                                                </div>
                                                <div className="text text-gray-700 space-y-2">
                                                    <p><strong>City:</strong> {station?.city}</p>
                                                    <p><strong>State:</strong> {station?.state}</p>
                                                    <p><strong>Country:</strong> {station?.country}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <!-- Trains List --> */}
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                                                <thead>
                                                    <tr className="bg-blue-950 text-white uppercase text-sm leading-normal">
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Train Name</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Train Number</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Arrival Time</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Departure Time</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Halt Duration</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Platform Number</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-600 text-sm font-semibold">
                                                    {
                                                        station?.trains?.length > 0 ? (
                                                            station?.trains?.map(train => {
                                                                let filtered = train?.route.find(route => route.station === station._id)
                                                                return <tr className="border-b border-gray-200 hover:bg-gray-100">
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{train?.name}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{train?.train_number}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{filtered?.arrival_time}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{filtered?.departure_time}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{filtered?.halt_time}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{filtered?.route_number}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left text-green-500">{station?.status}</td>
                                                                </tr>
                                                            })
                                                        ) : (
                                                            <tr className="border-b border-gray-200 hover:bg-gray-100">
                                                                <td colSpan={7} className="py-2 md:py-3 px-2 md:px-4 text-center p-2">No trains available</td>
                                                            </tr>
                                                        )
                                                    }

                                                </tbody>
                                            </table>
                                        </div>

                                    </section>
                                )
                            }


                        </div>
                    </main>
                )
            }
        </>
    )
}

export default StaionDetail