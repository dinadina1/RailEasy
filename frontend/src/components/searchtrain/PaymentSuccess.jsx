import { toast } from 'react-hot-toast';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getPaymentDetail } from '../../actions/bookingAction';
import Loader from '../layout/Loader';
import { clearBookingError } from '../../slices/bookingSlice';
import MetaData from '../layout/MetaData';
import AdminSidebar from '../layout/AdminSidebar';

const PaymentSuccess = ({ setBgImage }) => {

    const dispatch = useDispatch();
    const { id } = useParams();

    const { error, loading, payment = {} } = useSelector((state) => state.bookingState);
    const { user } = useSelector((state) => state.authState);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearBookingError());
        }
    }, [error]);

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getPaymentDetail(id));
        localStorage.removeItem("state");
        localStorage.removeItem("bookingData");
        localStorage.removeItem("passengersList");
        localStorage.removeItem("bookingId");
        localStorage.removeItem("payment");
        localStorage.removeItem("rzp_checkout_anon_id");
        localStorage.removeItem("rzp_device_id");

    }, []);

    return (
        <>
            <MetaData title={"Success"} />
            {
                loading ? <Loader /> :

                    <main className='flex'>
                        {
                            user?.role === "admin" && <AdminSidebar />
                        }
                        <div className={user?.role === "admin" ? "container p-2 md:p-5 w-full lg:5/6 mx-auto h-screen overflow-y-auto" : "container p-2 md:p-5 w-full"}>
                            <div className="border shadow-xl max-w-lg mx-auto text-center p-5">
                                <img src="/src/assets/success.png" alt="success" className="h-20 w-20 md:h-28 md:w-28 mx-auto" />
                                <p className="text-2xl md:text-3xl font-bold p-3 text-gray-700">Booking Successful</p>


                                <div className="p-5">
                                    <div className="md:p-4 font-semibold text-sm md:text-md">
                                        <article className="flex justify-between p-1">
                                            <p className="text-end">Journey :</p>
                                            <p className="text-start font-bold">{payment?.booking_id?.from_station?.name} TO {payment?.booking_id?.to_station?.name}</p>
                                        </article>
                                        <article className="flex justify-between p-1">
                                            <p className="text-end">Date of Journey :</p>
                                            <p className="text-start font-bold">{payment?.booking_id?.date_of_journey}</p>
                                        </article>
                                        <article className="flex justify-between p-1">
                                            <p className="text-end">PNR :</p>
                                            <p className="text-start font-bold">{payment?.booking_id?.pnr?.pnr_number}</p>
                                        </article>
                                        <article className="flex justify-between p-1">
                                            <p className="text-end">Transaction ID :</p>
                                            <p className="text-start font-bold">{payment?.transaction_id}</p>
                                        </article>
                                        <article className="flex justify-between p-1">
                                            <p className="text-end">Ticket Fare :</p>
                                            <p className="text-start font-bold">&#8377; {payment?.booking_id?.total_fare.toFixed(2)}</p>
                                        </article>
                                    </div>
                                </div>

                                <div className="text-center p-3">
                                    <Link to={"/"} className="border border-gray-800 text-gray-600 font-semibold px-5 py-2 rounded hover:bg-gray-200 mx-2"
                                    >Home</Link>
                                    <Link to={"/mybookings"} className="border bg-orange-600 text-white font-semibold px-5 py-2 rounded hover:bg-orange-700 mx-2"
                                        href="#">Bookings</Link>
                                </div>
                            </div>

                        </div>
                    </main>
            }
        </>
    )
}

export default PaymentSuccess