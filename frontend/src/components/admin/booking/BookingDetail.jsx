import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../layout/AdminSidebar';
import Loader from '../../layout/Loader';
import MetaData from '../../layout/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { getBooking, updateBookingById } from '../../../actions/bookingAction';
import { clearBookingError, clearIsBookingUpdated } from '../../../slices/bookingSlice';
import { toast } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';

const BookingDetail = ({ setBgImage }) => {

    const dispatch = useDispatch();
    const { id } = useParams();

    const { loading } = useSelector(state => state.authState);
    const { loading: bookingLoading, booking, error, isUpdated } = useSelector(state => state.bookingState);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [status, setStatus] = useState(booking?.booking_status);

    // change status modal
    function openModal() {
        setIsModalOpen(true);
    }
    function closeModal() {
        setIsModalOpen(false);
    }

    // function update status
    const handleUpdateStatus = (id) => {
        dispatch(updateBookingById(id, { booking_status: status }));
        closeModal();
    }

    const departureTime = booking?.train?.route?.find(route => route?.station === booking?.from_station?._id)
    const arrivalTime = booking?.train?.route?.find(route => route?.station === booking?.to_station?._id)

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearBookingError());
        }
        if (isUpdated) {
            toast.success("Status updated success");
            dispatch(clearIsBookingUpdated());
            // dispatch(getBookingById({ bookingId: formik.values.bookingId.toUpperCase() }));
        }
    }, [error, isUpdated]);

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getBooking(id));
    }, [id, isUpdated]);

    return (
        <>
            <MetaData title={"Booking List"} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        {/* <!-- main content --> */}
                        <div className="w-full bg-white shadow-xl overflow-auto">
                            <div className="flex justify-between p-3">
                                {/* <!-- Back button --> */}
                                <Link to={"/admin/booking/all"} className="max-w-sm p-3 flex text-blue-500 font-bold text-md md:text-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 my-auto" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Go Back
                                </Link>
                                <button onClick={openModal}
                                    className="flex items-center bg-blue-600 text-white px-5 md:px-6 py-1 md:py-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300 my-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M5 13l4 4H4v-3l1-1h4l4 4h5l5-5L12 3l-7 7L4 7v6H1v4h3l4 4h8l5-5" />
                                    </svg>
                                    <span >Change Status</span>
                                </button>
                            </div>
                            <div className="px-6 py-4">
                                <h2 className="text-3xl font-semibold text-gray-800">Booking Details</h2>
                                <p className="mt-2 text-gray-600">Detailed information about your booking:</p>
                            </div>
                            {
                                booking?._id && (
                                    <section className="p-2 md:p-6">
                                        {/* <!-- Train & Booking Info --> */}
                                        <div className="mx-1 md:mx-5 px-2 md:px-6 py-4 bg-indigo-50 border rounded ">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Booking ID:</span>
                                                    <span className="text-gray-800">{booking?.booking_id}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">PNR Number:</span>
                                                    <span className="text-gray-800">{booking?.pnr?.pnr_number}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Train Name:</span>
                                                    <span className="text-gray-800">{booking?.train?.name}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">className:</span>
                                                    <span className="text-gray-800">{booking?.class?.name}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Departure Station:</span>
                                                    <span className="text-gray-800">{booking?.from_station?.name}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Arrival Station:</span>
                                                    <span className="text-gray-800">{booking?.to_station?.name}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Departure Time:</span>
                                                    <span className="text-gray-800">{departureTime?.departure_time}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Arrival Time:</span>
                                                    <span className="text-gray-800">{arrivalTime?.arrival_time}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Date of journey</span>
                                                    <span className="text-gray-800">{booking?.date_of_journey}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Amenities</span>
                                                    <span className="text-gray-800">{booking?.class?.amentities}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Status:</span>
                                                    <span
                                                        className={`font-semibold px-2 py-1 rounded w-fit ${booking?.booking_status === "Cancelled"
                                                            ? "bg-red-100 text-red-500"
                                                            : booking?.booking_status === "Pending"
                                                                ? "bg-yellow-100 text-yellow-500"
                                                                : booking?.booking_status === "Confirmed"
                                                                    ? "bg-green-100 text-green-500"
                                                                    : "bg-gray-100 text-gray-500"
                                                            }`}
                                                    >
                                                        {booking?.booking_status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Chart Prepared</span>
                                                    <span className="text-gray-800">{booking?.chart_prepared ? "Yes" : "No"}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Category</span>
                                                    <span className="text-gray-800">{booking?.train?.category}</span>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="border-t border-gray-200"></div>

                                        <div className="mx-1 md:mx-5  px-6 py-4">
                                            <h3 className="text-xl font-bold text-gray-800">Contact Details</h3>
                                            <div className="flex gap-3 md:gap-10 flex-wrap p-2">
                                                <p><span className="text-gray-500 font-semibold pe-2">Email:</span> {booking?.contact?.email ? booking?.contact?.email : "None"}</p>
                                                <p><span className="text-gray-500 font-semibold pe-2">Phone no:</span> {booking?.contact?.phone_no ? booking?.contact?.phone_no : "None"}</p>
                                            </div>
                                        </div>

                                        {/* <!-- Passenger Details Table --> */}
                                        <div className="mx-1 md:mx-5 px-2 md:px-6">
                                            <h3 className="text-xl font-bold text-gray-800">Passenger Details</h3>
                                            <div className="overflow-x-auto mt-4">
                                                <table className="min-w-full bg-white border border-gray-300 shadow-lg ">
                                                    <thead className="bg-blue-950 text-white">
                                                        <tr>
                                                            <th className="py-2 px-4 border-b text-left">Passenger Name</th>
                                                            <th className="py-2 px-4 border-b text-left">Age</th>
                                                            <th className="py-2 px-4 border-b text-left">Gender</th>
                                                            <th className="py-2 px-4 border-b text-left">Seat Number</th>
                                                            <th className="py-2 px-4 border-b text-left">Berth</th>
                                                            <th className="py-2 px-4 border-b text-left">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            booking?.passengers?.map((passenger, index) => (
                                                                <tr key={index}>
                                                                    <td className="py-2 px-4 border-b">{passenger?.name}</td>
                                                                    <td className="py-2 px-4 border-b">{passenger?.age}</td>
                                                                    <td className="py-2 px-4 border-b">{passenger?.gender}</td>
                                                                    <td className="py-2 px-4 border-b">{passenger?.seat_number}</td>
                                                                    <td className="py-2 px-4 border-b">{passenger?.berth}</td>
                                                                    <td className="py-2 px-4 border-b">{passenger?.status}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-200"></div>

                                        {/* <!-- Fare Details --> */}
                                        <div className="mx-1 md:mx-5 px-2 md:px-6 mb-4">
                                            <h3 className="text-xl font-bold text-gray-800">Fare Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Base Fare:</span>
                                                    <span className="text-gray-800">&#8377;{(booking?.payment?.amount - (booking?.payment?.amount * booking?.train?.tax_percent) / 100).toFixed(2)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Service Tax:</span>
                                                    <span className="text-gray-800">&#8377;{((booking?.payment?.amount * booking?.train?.tax_percent) / 100).toFixed(2)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Total Fare:</span>
                                                    <span className="text-gray-800">&#8377;{booking?.payment?.amount.toFixed(2)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Payment Status:</span>
                                                    <span
                                                        className={`font-semibold px-2 py-1 rounded w-fit ${booking?.payment?.status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-500"
                                                            : booking?.payment?.status === "Success"
                                                                ? "bg-green-100 text-green-500"
                                                                : "bg-red-100 text-red-500"
                                                            }`}
                                                    >
                                                        {booking?.payment?.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Payment Method:</span>
                                                    <span className="text-gray-800">{booking?.payment?.method}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Transaction ID:</span>
                                                    <span className="text-gray-800">{booking?.payment?.transaction_id}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-600">Payment Date:</span>
                                                    <span className="text-gray-800">{booking?.payment?.payment_date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )
                            }
                        </div>


                        {/* <!--Change status Modal --> */}
                        {
                            isModalOpen && (
                                <div id="modal" className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                                    {/* <!-- Modal Content --> */}
                                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                                        <div className="flex justify-between items-center border-b pb-3">
                                            <h3 className="text-xl font-semibold text-gray-800">Change Booking Status</h3>
                                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-2 p-3">
                                            <label htmlFor="status" className="text-gray-500 font-semibold">Select Status</label>
                                            <select name="status" id="status" value={status} onChange={(e) => setStatus(e.target.value)}
                                                className="text-gray-500 border-b-2 border-gray-400 outline-none focus:border-gray-600">
                                                <option value="" default>--Select--</option>
                                                <option value="Confirmed" default>Confirmed</option>
                                                <option value="Cancelled" default>Cancelled</option>
                                                <option value="Pending" default>Pending</option>
                                            </select>
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <button onClick={() => handleUpdateStatus(booking?._id)}
                                                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </main>
                )
            }
        </>
    )
}

export default BookingDetail