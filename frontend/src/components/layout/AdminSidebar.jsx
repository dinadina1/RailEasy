import React from 'react'
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/authAction';
import { Link, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    // function to logout
    const logout = () => {
        dispatch(logoutUser);
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('translate-x-0');
        sidebar.classList.add('translate-x-full');

        navigate("/", { replace: true });
    }

    return (
        <div id="adminBar" className=" hidden lg:block lg:w-1/6 bg-gray-800 h-screen py-5 px-2 overflow-y-auto">
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

export default AdminSidebar