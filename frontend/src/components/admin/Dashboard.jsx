import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';
import AdminSidebar from '../layout/AdminSidebar';
import { getAllTrains } from '../../actions/trainAction';
import { getAllBookings } from '../../actions/bookingAction';
import { getAllStations } from '../../actions/stationAction';
import { getAllUsers } from '../../actions/authAction';

const Dashboard = ({ setBgImage }) => {

    const dispatch = useDispatch();

    const { users } = useSelector(state => state.authState);
    const { loading, trains } = useSelector(state => state.trainState);
    const { bookings } = useSelector(state => state.bookingState);
    const { stations } = useSelector(state => state.stationState);


    // calculate revenue
    const revenue = bookings?.reduce((acc, booking) => acc + booking.total_fare, 0);

    // calculate cancelation
    let cancelation = 0;
    bookings?.forEach(booking => {
        if (booking?.booking_status === "Cancelled") {
            cancelation += 1;
        }
    });

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getAllTrains);
        dispatch(getAllBookings);
        dispatch(getAllStations);
        dispatch(getAllUsers);
    }, []);

    return (
        <>
            <MetaData title={"Admin Dashboard"} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        <div id="main" className="w-full lg:w-5/6 h-auto p-8 bg-gray-100 min-h-screen">
                            <h1 className="text-2xl md:text-4xl font-bold mb-6">Dashboard</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* <!-- Card 1: Total Users --> */}
                                <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-700"> Users</h2>
                                        <p className="text-3xl font-bold text-gray-900">{users?.length?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-blue-500 text-white p-4 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                            stroke="currentColor" className="h-8 w-8">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M4.5 12.75L12 19.5l7.5-6.75M12 19.5V3" />
                                        </svg>
                                    </div>
                                </div>

                                {/* <!-- Card 2: Total Trains --> */}
                                <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-700"> Trains</h2>
                                        <p className="text-3xl font-bold text-gray-900">{trains?.length?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-green-500 text-white p-4 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" className="w-6 h-6 text-white"
                                            viewBox="0 0 448 512" stroke-width="1.5" stroke="currentColor">
                                            <path
                                                d="M96 0C43 0 0 43 0 96L0 352c0 48 35.2 87.7 81.1 94.9l-46 46C28.1 499.9 33.1 512 43 512l39.7 0c8.5 0 16.6-3.4 22.6-9.4L160 448l128 0 54.6 54.6c6 6 14.1 9.4 22.6 9.4l39.7 0c10 0 15-12.1 7.9-19.1l-46-46c46-7.1 81.1-46.9 81.1-94.9l0-256c0-53-43-96-96-96L96 0zM64 128c0-17.7 14.3-32 32-32l80 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-80 0c-17.7 0-32-14.3-32-32l0-96zM272 96l80 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-80 0c-17.7 0-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM64 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm288-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* <!-- Card 3: Total Bookings --> */}
                                <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-700"> Bookings</h2>
                                        <p className="text-3xl font-bold text-gray-900">{bookings?.length?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-red-500 text-white p-4 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                            stroke="currentColor" className="h-8 w-8">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 3v18M18 3v18M3 12h18" />
                                        </svg>
                                    </div>
                                </div>

                                {/* <!-- Card 4: Total Revenue --> */}
                                <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-700"> Revenue</h2>
                                        <p className="text-3xl font-bold text-gray-900">&#8377;{revenue?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-yellow-500 text-white p-4 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" stroke-width="1.5"
                                            fill="currentcolor" stroke="currentColor" className="h-8 w-8">
                                            <path
                                                d="M0 64C0 46.3 14.3 32 32 32l64 0 16 0 176 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-56.2 0c9.6 14.4 16.7 30.6 20.7 48l35.6 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-35.6 0c-13.2 58.3-61.9 103.2-122.2 110.9L274.6 422c14.4 10.3 17.7 30.3 7.4 44.6s-30.3 17.7-44.6 7.4L13.4 314C2.1 306-2.7 291.5 1.5 278.2S18.1 256 32 256l80 0c32.8 0 61-19.7 73.3-48L32 208c-17.7 0-32-14.3-32-32s14.3-32 32-32l153.3 0C173 115.7 144.8 96 112 96L96 96 32 96C14.3 96 0 81.7 0 64z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* <!-- Card 5: Total stations --> */}
                                <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-700"> Stations</h2>
                                        <p className="text-3xl font-bold text-gray-900">{stations?.length?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-purple-500 text-white p-4 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                            className="w-6 h-6 bg-gray-800 text-white p-3 rounded-full">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6h12M6 18h12" />
                                        </svg>
                                    </div>
                                </div>
                                {/* <!-- Card 6: Total cancellation --> */}
                                <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-700"> Cancellation</h2>
                                        <p className="text-3xl font-bold text-gray-900">{cancelation}</p>
                                    </div>
                                    <div className="bg-orange-500 text-white p-4 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="24" height="24"
                                            fill="currentcolor">
                                            <path
                                                d="M64 64C28.7 64 0 92.7 0 128l0 64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320l0 64c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-64c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6l0-64c0-35.3-28.7-64-64-64L64 64zm64 112l0 160c0 8.8 7.2 16 16 16l288 0c8.8 0 16-7.2 16-16l0-160c0-8.8-7.2-16-16-16l-288 0c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-320 0c-17.7 0-32-14.3-32-32l0-192z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </main>
                )
            }
        </>
    )
}

export default Dashboard