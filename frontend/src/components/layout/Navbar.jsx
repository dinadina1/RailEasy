import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../actions/authAction';
import icon from '../../assets/logo.ico'

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticatedUser, user, loading = true } = useSelector(state => state.authState);
    const [currentTime, setCurrentTime] = useState(null);

    // Initialize state to track sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    function showTrain() {
        var trainList = document.querySelectorAll('#trainList');
        trainList.forEach(train => {
            train.classList.toggle('hidden');
            train.classList.toggle('transform');
        })
    }

    function showStation() {
        var elements = document.querySelectorAll('#stationList');
        elements.forEach(element => {
            element.classList.toggle('hidden');
            element.classList.toggle('transform');
        })
    }

    // show booking 
    const showBooking = () => {
        var elements = document.querySelectorAll('#bookingList');
        elements.forEach(element => {
            element.classList.toggle('hidden');
            element.classList.toggle('transform');
        })
    }
    // show payment 
    const showPayment = () => {
        var elements = document.querySelectorAll('#paymentList');
        elements.forEach(element => {
            element.classList.toggle('hidden');
            element.classList.toggle('transform');
        })
    }

    // get current date and time
    useEffect(() => {
        if (isAuthenticatedUser) {
            const interval = setInterval(() => {
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleDateString('en-US');
                const formattedTime = currentDate.toLocaleTimeString('en-US');
                setCurrentTime(`${formattedDate} ${formattedTime}`);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isAuthenticatedUser]);

    // Function to toggle the sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Function to handle clicks outside of the sidebar
    const handleOutsideClick = (event) => {
        const sidebar = document.getElementById('sidebar');
        const openSidebarButton = document.getElementById('openSidebar');

        if (
            isSidebarOpen &&
            !sidebar.contains(event.target) &&
            !openSidebarButton.contains(event.target)
        ) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isSidebarOpen]);

    // function to logout
    const logout = () => {
        dispatch(logoutUser);
        setIsSidebarOpen(false);
        navigate("/", { replace: true });
    }

    return (
        <>
            {
                loading ? null : isAuthenticatedUser ? (
                    <nav className="flex justify-between bg-gray-800 md:px-8 py-3 shadow-xl">
                        <Link to={"/"}>
                            <img src={icon} className="h-12 my-auto" alt="logo" />
                        </Link>
                        <div className="flex gap-5">
                            <div className="text-lg font-bold flex gap-3 flex-wrap">
                                <img src={user.avatar} alt="avatar" className="h-12 w-12 rounded-full my-auto" />
                                <span className="my-auto text-white">{user.username}</span>
                            </div>
                            <button id="openSidebar" onClick={toggleSidebar} className={user.role === "admin" ? "text-white px-3 py-2 rounded-md lg:hidden" : "text-white px-3 py-2 rounded-md "}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                        </div>
                    </nav>
                ) : (
                    <nav className="flex justify-between md:px-5 py-3">
                        <Link to={"/"}>
                            <img src={icon} className="h-12 my-auto" alt="logo" />
                        </Link>
                        <div className="my-auto gap-5">
                            <Link to={"/login"} className="bg-gray-900 text-white px-5 py-2 rounded text-md font-semibold mx-2">Login</Link>
                            <Link to={"/register"} className="text-white border px-5 py-2 rounded text-md font-semibold mx-2">Register</Link>
                        </div>
                    </nav>
                )
            }

            {/* Sidebar */}
            {
                isSidebarOpen && (
                    <div id="sidebar" className={user.role === "admin" ? "fixed top-0 right-0 w-64 h-full bg-gray-800 text-white transform transition-transform duration-300 z-10 overflow-auto lg:hidden" : "fixed top-0 right-0 w-64 h-full bg-gray-800 text-white transform transition-transform duration-300 z-10 overflow-auto"}>
                        <div className="p-4 flex justify-between items-center">
                            <div className="text-lg font-bold flex gap-3 flex-wrap">
                                <img src={user?.avatar} alt="avatar" className="h-12 w-12 rounded-full my-auto" />
                                <span className="my-auto">{user.username}</span>
                            </div>
                            <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
                                &times;
                            </button>
                        </div>
                        <p className="p-4">{currentTime}</p>
                        <hr />
                        <ul className="p-2">
                            {/* admin routes */}
                            {
                                user.role === "admin" && (
                                    <ul className="text-white ">
                                        <Link to={"/admin/dashboard"} className="block p-2 rounded font-semibold hover:bg-white hover:text-gray-800">
                                            Dashboard
                                        </Link>
                                        <li onClick={showTrain}
                                            className=" flex justify-between cursor-pointer p-2 rounded font-semibold hover:bg-white hover:text-gray-800">
                                            <a href="">Train</a>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                                stroke="currentColor" className="size-4 my-auto">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </li>
                                        <ul id="trainList" className="hidden transform transition-transform duration-500">
                                            <Link to={"/admin/train/create"} className="block p-2 ps-7 hover:bg-white hover:text-gray-800 rounded">
                                                Create new Train
                                            </Link>
                                            <Link to={"/admin/train/schedule"} className="block p-2 ps-7 hover:bg-white hover:text-gray-800 rounded">
                                                Train Schedule
                                            </Link>
                                            <Link to={"/admin/train/search"} className="block p-2 ps-7 hover:bg-white hover:text-gray-800 rounded">
                                                Search Train
                                            </Link>
                                            <Link to={"/admin/train/all"} className="block p-2 ps-7 hover:bg-white hover:text-gray-800 rounded">
                                                All Trains
                                            </Link>

                                        </ul>
                                        <li onClick={showStation}
                                            className="flex justify-between p-2 rounded font-semibold hover:bg-white hover:text-gray-800">
                                            <a href="">Station</a>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                                stroke="currentColor" className="size-4 my-auto">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </li>
                                        <ul id="stationList" className="hidden transform transition-transform duration-500">
                                            <Link to={"/admin/station/create"} className="block p-2 ps-7 hover:bg-white hover:text-gray-800 rounded">
                                                Create new station
                                            </Link>
                                            <Link to={"/admin/station/schedule"} className="block p-2 ps-7 hover:bg-white hover:text-gray-800 rounded">
                                                Station Schedule
                                            </Link>
                                            <Link to={"/admin/station/search"} className="block p-2 ps-7 hover:bg-white hover:text-gray-800 rounded">
                                                Search Station
                                            </Link>
                                            <Link to={"/admin/station/all"} className="block p-2 ps-7 hover:bg-white hover:text-gray-800 rounded">
                                                All Stations
                                            </Link>
                                        </ul>
                                        <li onClick={showBooking}
                                            className="flex justify-between p-2 rounded font-semibold hover:bg-white hover:text-gray-800">
                                            <a href="">Bookings</a>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                                stroke="currentColor" className="size-4 my-auto">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </li>
                                        <ul id="bookingList" className="hidden transform transition-transform duration-500">
                                            <Link to={"/admin/booking/search"} className="block p-2 ps-7 hover:bg-white hover:text-gray-800 rounded">
                                                Search Booking
                                            </Link>
                                            <Link to={"/admin/booking/all"} className="block p-2 ps-7 hover:bg-white hover:text-gray-800 rounded">
                                                All Bookings
                                            </Link>
                                            <Link to={"/admin/booking/manual"} className="block p-2 ps-7 hover:bg-white hover:text-gray-800 rounded">
                                                Manual Ticket
                                            </Link>
                                        </ul>
                                        <Link to={"/admin/transaction/all"} className="block p-2 font-semibold hover:bg-white hover:text-gray-800 rounded">
                                            Transaction List
                                        </Link>
                                        <Link to={"/admin/report/dailytransaction"} className="block p-2 font-semibold hover:bg-white hover:text-gray-800 rounded">
                                            Daily Report
                                        </Link>

                                        <hr className="my-2" />
                                    </ul>
                                )
                            }

                            <Link to={"/"} className="p-2 block rounded font-semibold hover:bg-white hover:text-gray-800">Home</Link>
                            <Link to={"/pnrenquiry"} className="p-2 block rounded font-semibold hover:bg-white hover:text-gray-800">PNR Enquiry</Link>
                            <Link to={"/mybookings"} className="p-2 block rounded font-semibold hover:bg-white hover:text-gray-800">My Bookings</Link>
                            <Link to={"/trainschedule"} className="p-2 block rounded font-semibold hover:bg-white hover:text-gray-800">Train Schedule</Link>
                            <Link to={"/fareenquiry"} className="p-2 block rounded font-semibold hover:bg-white hover:text-gray-800">Fare Enquiry</Link>
                            <Link to={"/reservationchart"} className="p-2 block rounded font-semibold hover:bg-white hover:text-gray-800">Reservation Chart</Link>
                            <hr className="mt-2" />
                            <li onClick={logout} className="p-2 cursor-pointer hover:underline text-red-500 rounded font-semibold hover:bg-white">Logout</li>
                            <hr className="mt-1" />
                        </ul>
                    </div>
                )
            }
        </>
    );
};

export default Navbar;
