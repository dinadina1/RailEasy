import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../layout/AdminSidebar';
import Loader from '../../layout/Loader';
import MetaData from '../../layout/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBookings } from '../../../actions/bookingAction';
import { toast } from 'react-hot-toast'
import { clearBookingError } from '../../../slices/bookingSlice';
import { Link } from 'react-router-dom';

const BookingList = ({ setBgImage }) => {

    const dispatch = useDispatch();

    const { loading } = useSelector(state => state.authState);
    const { bookings, error } = useSelector(state => state.bookingState);

    const [bookingList, setBookingList] = useState(bookings);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // function to handle search
    const handleSearch = (e) => {
        let updateBookingList = bookingList;

        if (searchQuery) {
            updateBookingList = bookingList.filter(booking => {
                return booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    booking.train.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    booking.class.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    booking.status.toLowerCase().includes(searchQuery.toLowerCase())
            });
        } else {
            const newList = [];
            bookings.map(booking => {
                booking.passengers.forEach(passenger => {
                    newList.push({
                        _id: booking._id,
                        name: passenger.name,
                        bookingId: booking.booking_id,
                        status: booking.booking_status,
                        date: booking.date_of_journey,
                        train: booking.train,
                        class: booking.class
                    });
                });
            });
            updateBookingList = newList;
        }

        // filter by status
        if (filterStatus) {
            updateBookingList = updateBookingList.filter(booking => booking.status.toLowerCase() === filterStatus.toLowerCase());
        }

        // filter by date
        if (filterDate) {
            const today = new Date();
            const todayDate = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            if (filterDate === 'today') {
                updateBookingList = updateBookingList.filter(booking => booking.date === todayDate);
            }
            else if (filterDate === 'tomorrow') {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date
                const tomorrowDate = tomorrow.toISOString().split('T')[0];

                updateBookingList = updateBookingList.filter(booking => booking.date === tomorrowDate);
            }
            else if (filterDate === 'this-week') {
                const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the current week (Sunday)
                const endOfWeek = new Date(today.setDate(today.getDate() + 6)); // End of the current week (Saturday)
                const startOfWeekDate = startOfWeek.toISOString().split('T')[0];
                const endOfWeekDate = endOfWeek.toISOString().split('T')[0];

                updateBookingList = updateBookingList.filter(booking =>
                    booking.date >= startOfWeekDate && booking.date <= endOfWeekDate
                );
            }
            else if (filterDate === 'next-week') {
                const startOfNextWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Start of next week
                const endOfNextWeek = new Date(startOfNextWeek.getTime() + 6 * 24 * 60 * 60 * 1000); // End of next week (7 days)
                const startOfNextWeekDate = startOfNextWeek.toISOString().split('T')[0];
                const endOfNextWeekDate = endOfNextWeek.toISOString().split('T')[0];

                updateBookingList = updateBookingList.filter(booking =>
                    booking.date >= startOfNextWeekDate && booking.date <= endOfNextWeekDate
                );
            }
            else if (filterDate === 'this-month') {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the current month
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of the current month
                const startOfMonthDate = startOfMonth.toISOString().split('T')[0];
                const endOfMonthDate = endOfMonth.toISOString().split('T')[0];

                updateBookingList = updateBookingList.filter(booking =>
                    booking.date >= startOfMonthDate && booking.date <= endOfMonthDate
                );
            }
            else if (filterDate === 'next-month') {
                const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // Start of next month
                const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0); // End of next month
                const startOfNextMonthDate = startOfNextMonth.toISOString().split('T')[0];
                const endOfNextMonthDate = endOfNextMonth.toISOString().split('T')[0];

                updateBookingList = updateBookingList.filter(booking =>
                    booking.date >= startOfNextMonthDate && booking.date <= endOfNextMonthDate
                );
            }
            else if (filterDate === 'last-week') {
                const startOfLastWeek = new Date(today.setDate(today.getDate() - today.getDay() - 7)); // Start of last week
                const endOfLastWeek = new Date(today.setDate(today.getDate() + 6)); // End of last week
                const startOfLastWeekDate = startOfLastWeek.toISOString().split('T')[0];
                const endOfLastWeekDate = endOfLastWeek.toISOString().split('T')[0];

                updateBookingList = updateBookingList.filter(booking =>
                    booking.date >= startOfLastWeekDate && booking.date <= endOfLastWeekDate
                );
            }
            else if (filterDate === 'last-month') {
                const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Start of last month
                const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // End of last month
                const startOfLastMonthDate = startOfLastMonth.toISOString().split('T')[0];
                const endOfLastMonthDate = endOfLastMonth.toISOString().split('T')[0];

                updateBookingList = updateBookingList.filter(booking =>
                    booking.date >= startOfLastMonthDate && booking.date <= endOfLastMonthDate
                );
            }
        }
        // update booking list
        setBookingList(updateBookingList);
    };

    // useeffect for filter list by status
    useEffect(() => {
        handleSearch();
    }, [searchQuery, filterDate, filterStatus])

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearBookingError());
        }

        const newList = [];
        bookings.map(booking => {
            booking.passengers.forEach(passenger => {
                newList.push({
                    _id: booking._id,
                    name: passenger.name,
                    bookingId: booking.booking_id,
                    status: booking.booking_status,
                    date: booking.date_of_journey,
                    train: booking.train,
                    class: booking.class
                });
            });
        });

        setBookingList(newList);
    }, [error, bookings]);

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getAllBookings);
    }, []);

    return (
        <>
            <MetaData title={"Booking List"} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        <main id="main" className="w-full lg:w-5/6 md:p-8 bg-gray-100 min-h-screen ">
                            <div className=" w-full bg-blue-950 p-3 text-center mb-3 text-white px-6">
                                <h2 className="text-xl font-bold ">Booking List</h2>
                            </div>

                            <div className="flex justify-between items-center my-4 gap-3 flex-wrap">
                                <input type="search" id="search" placeholder="Search bookings..." onChange={(e) => setSearchQuery(e.target.value)}
                                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600" />

                                <div className="flex space-x-4">
                                    <select id="statusFilter" onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600">
                                        <option value="">Filter by Status</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>

                                    <select id="dateFilter" onChange={(e) => setFilterDate(e.target.value)}
                                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600">
                                        <option value="">Filter by Date</option>
                                        <option value="today">Today</option>
                                        <option value="tomorrow">Tomorrow</option>
                                        <option value="this-week">This Week</option>
                                        <option value="this-month">This Month</option>
                                        <option value="next-week">Next Week</option>
                                        <option value="next-month">Next Month</option>
                                        <option value="last-week">Last Week</option>
                                        <option value="last-month">Last Month</option>
                                    </select>
                                </div>
                            </div>

                            <p className='p-2 text-gray-600 font-bold text-lg'>{bookingList.length} results found.</p>
                            {/* <!-- Booking List Table --> */}
                            <div className="overflow-x-auto p-2">
                                <table className="min-w-full bg-white rounded-lg shadow-md">
                                    <thead>
                                        <tr className="bg-gray-700 text-white uppercase text-sm leading-normal">
                                            <th className="py-2 md:py-3 px-2 md:px-4 text-left">Booking ID</th>
                                            <th className="py-2 md:py-3 px-2 md:px-4 text-left">Passenger Name</th>
                                            <th className="py-2 md:py-3 px-2 md:px-4 text-center">Train</th>
                                            <th className="py-2 md:py-3 px-2 md:px-4 text-center">Date</th>
                                            <th className="py-2 md:py-3 px-2 md:px-4 text-center">className</th>
                                            <th className="py-2 md:py-3 px-2 md:px-4 text-center">Status</th>
                                            <th className="py-2 md:py-3 px-2 md:px-4 text-center">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody id="bookingTable" className="text-gray-600 text-sm font-semibold">

                                        {
                                            bookingList?.length > 0 ?
                                                bookingList.map((booking, index) => {
                                                    return (
                                                        <tr key={index} className="border-b border-gray-400 hover:bg-gray-100">
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-left whitespace-nowrap">{booking?.bookingId}</td>
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-left">{booking?.name}</td>
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-center">{booking?.train?.name}</td>
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-center">{booking?.date}</td>
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-center">{booking?.class?.name}</td>
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-center">
                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-xs ${booking?.status?.toLowerCase() === 'confirmed' ? 'bg-green-200 text-green-600' : booking?.status?.toLowerCase() === 'pending' ? 'bg-yellow-200 text-yellow-600' : 'bg-red-200 text-red-600'}`}>
                                                                    {booking?.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 md:py-3 px-2 md:px-4 text-center">
                                                                <Link to={`/admin/booking/${booking._id}`}
                                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none">View</Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                }) : <tr className="border-b border-gray-400 hover:bg-gray-100">
                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-center whitespace-nowrap" colSpan="7">No bookings found</td>
                                                </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>


                        </main>
                    </main>
                )
            }
        </>
    )
}

export default BookingList