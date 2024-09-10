import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { getBookings, newBooking } from '../../actions/bookingAction';
import { toast } from 'react-hot-toast';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import AdminSidebar from '../layout/AdminSidebar';

const ReviewJourney = ({ setBgImage }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { bookings = [], loading, error, booking = {} } = useSelector(state => state.bookingState);
    const { user } = useSelector(state => state.authState);

    const [bookingData, setBookingData] = useState(localStorage.getItem('bookingData') ? JSON.parse(localStorage.getItem('bookingData')) : []);
    const [totalFare, setTotalFare] = useState(0);
    const [updatedPassengers, setUpdatedPassengers] = useState(null);
    const [seats, setSeats] = useState([]);

    // function to get adult count
    const getAdultCount = () => {
        let count = 0;
        bookingData?.passengers?.forEach(passenger => {
            if (passenger.age >= 18) {
                count++;
            }
        });
        return count;
    }
    // function to get minor count
    const getMinorCount = () => {
        let count = 0;
        bookingData?.passengers?.forEach(passenger => {
            if (passenger.age < 18) {
                count++;
            }
        });
        return count;
    }

    // function to generate passenger seat numbers
    const generateSeatNumbers = (bookings, date, trainId, classId) => {
        const bookingsForDate = bookings.filter((book) => {
            return new Date(book.date_of_journey).toString() === new Date(date).toString() && trainId.toString() === book.train._id.toString() && classId.toString() === book.class._id.toString();
        });

        if (bookingsForDate.length <= 0) {
            let seatNo = 1;
            let updatedPassengers = [];
            let seatsList = [];
            bookingData?.passengers?.forEach(pass => {
                updatedPassengers = [...updatedPassengers, { ...pass, seat_number: `S${seatNo.toString().padStart(3, '0')}` }];
                seatsList = [...seatsList, `S${seatNo.toString().padStart(3, '0')}`];
                seatNo++;
            });
            setSeats(seatsList);
            return updatedPassengers;
        };

        let passengers = [];
        bookingsForDate.forEach(book => {
            passengers = [...passengers, ...book.passengers];
        });

        // Get the last passenger's seat number and extract the number part
        const lastSeatNumber = passengers[passengers.length - 1].seat_number;
        const lastSeatNumberValue = parseInt(lastSeatNumber.slice(1), 10);

        // Increment the seat number and format it with leading zeros
        const nextSeatNumberValue = (lastSeatNumberValue + 1);
        let seatNo = nextSeatNumberValue;
        let updatedPassengers = [];
        let seatsList = [];
        bookingData?.passengers?.forEach(pass => {
            updatedPassengers = [...updatedPassengers, { ...pass, seat_number: `S${seatNo.toString().padStart(3, '0')}` }];
            seatsList = [...seatsList, `S${seatNo.toString().padStart(3, '0')}`];
            seatNo++;
        });
        setSeats(seatsList);
        return updatedPassengers;
    }

    // function to handleSubmit
    const handleSubmit = () => {
        const formData = {
            train: bookingData.train._id,
            date_of_journey: bookingData.date,
            from_station: bookingData.from.station._id,
            to_station: bookingData.to.station._id,
            boarding_station: bookingData.from.station._id,
            reservation_upto: bookingData.to.station._id,
            departure_time: bookingData.from.departure_time,
            arrival_time: bookingData.to.arrival_time,
            class: bookingData.class._id,
            passengers: updatedPassengers,
            total_fare: totalFare,
            contact: {
                email: bookingData.user.email,
                phone_no: bookingData.user.phoneno,
            },
        }

        const bookingId = JSON.parse(localStorage.getItem('bookingId'));
        if (bookingId) {
            localStorage.setItem('state', JSON.stringify(["1", "2", "3"]));
            navigate('/ticket/book/payment');
        } else {
            dispatch(newBooking(formData));
            localStorage.setItem('state', JSON.stringify(["1", "2", "3"]));
        }
    }

    useEffect(() => {
        if (booking._id) {
            localStorage.setItem('bookingId', JSON.stringify(booking._id));
            navigate('/ticket/book/payment');
        }
        if (error) {
            toast.error(error);
        }
    }, [error, booking._id]);

    useEffect(() => {
        const totFare = bookingData?.totalFare + bookingData?.totalFare / 100 * bookingData?.train?.tax_percent
        setTotalFare(totFare.toFixed(2));

        // find seat numbers
        const newPassenges = generateSeatNumbers(bookings, bookingData?.date, bookingData?.train?._id, bookingData?.class?._id);
        setUpdatedPassengers(newPassenges);
    }, [bookings, bookingData]);

    useEffect(() => {
        setBgImage("bg-white");
        const state = JSON.parse(localStorage.getItem('state'));
        if (!state || !state.includes("2")) {
            navigate('/ticket/book/passengers');
        } else {
            dispatch(getBookings);
        }
    }, []);

    return (
        <>
            <MetaData title={"Review Journey"} />
            {
                loading ? <Loader /> :

                    <main className='flex'>
                        {
                            user?.role === "admin" && <AdminSidebar />
                        }
                        <div className={user?.role === "admin" ? "container p-2 md:p-5 w-full lg:5/6 mx-auto h-screen overflow-y-auto" : "container p-2 md:p-5 w-full"}>

                            {/* Steps Navigation */}
                            <div className="flex justify-between md:mx-24 p-2 md:p-4">
                                <article className="text-center">
                                    <Link to={"/ticket/book/passengers"} className="rounded-full mx-auto px-4 py-2 bg-orange-500 text-white font-bold my-3">1</Link>
                                    <p className="text-gray-600 text-xs md:text-sm font-semibold my-3">Passenger Details</p>
                                </article>
                                <article className="text-center">
                                    <Link to={"/ticket/book/reviewjourney"} className="rounded-full mx-auto px-4 py-2 bg-orange-500 text-white font-bold my-3">2</Link>
                                    <p className="text-gray-600 text-xs md:text-sm font-semibold my-3">Review Journey</p>
                                </article>
                                <article className="text-center">
                                    <Link to={"/ticket/book/payment"} className="rounded-full mx-auto px-4 py-2 bg-gray-400 text-white font-bold my-3">3</Link>
                                    <p className="text-gray-600 text-xs md:text-sm font-semibold my-3">Payment</p>
                                </article>
                            </div>

                            <div className="flex ">
                                <div className="w-full md:w-4/5 p-1 md:p-4">
                                    <div className="border border-gray-500 rounded pb-3">
                                        <h1 className="font-bold text-xl p-1 bg-gray-300">{bookingData?.train?.name} ({bookingData?.train?.train_number})</h1>
                                        <div className="p-3 flex justify-between flex-wrap">
                                            <article>
                                                <p className="font-bold">{bookingData?.from?.departure_time} | {bookingData?.from?.station?.name}</p>
                                                <p className="text-center font-semibold text-sm">{bookingData?.departure_date}</p>
                                            </article>
                                            <article>
                                                --- <span className="font-semibold">{bookingData?.travel_duration}</span> ---
                                            </article>
                                            <article>
                                                <p className="font-bold">{bookingData?.to?.arrival_time} | {bookingData?.to?.station?.name}</p>
                                                <p className="text-center font-semibold text-sm">{bookingData?.arrivalDate}</p>
                                            </article>
                                        </div>
                                        <article className='flex justify-center gap-2'>
                                            {
                                                seats.length > 0 && seats.map((seat, index) => {
                                                    return <p key={index} className="font-bold text-red-600">{seat}</p>
                                                })
                                            }
                                        </article>
                                        <p className="font-bold text-sm border-1 w-fit rounded bg-gray-300 p-1 px-5 mx-auto my-2">
                                            {getAdultCount() > 0 && getAdultCount() + 'Adult'}{getMinorCount() > 0 && ' |' + getMinorCount() + 'Minor'} | {bookingData?.className?.toUpperCase()} ({bookingData?.className?.toUpperCase().slice(0, 2)}) | {bookingData?.category?.toUpperCase()} | Boarding at {bookingData?.from?.station?.name} | Boarding Date: {bookingData?.departure_date} {bookingData?.from?.departure_time}
                                        </p>
                                    </div>

                                    <div className="border border-gray-300 p-3 py-2 my-4">
                                        <h1 className="text-2xl font-bold text-gray-700">Passenger Details</h1>
                                        {
                                            bookingData?.passengers?.length > 0 && bookingData?.passengers.map((pass, index) => {
                                                return <div key={index} className="text-gray-600 text-sm p-3">
                                                    <span className="font-bold text-md px-2 ">{index + 1}. {pass.name}</span>
                                                    {pass.age} yrs | {pass.gender} | {pass.country} | {pass.berth}
                                                </div>
                                            })
                                        }
                                    </div>

                                    <div className="border border-gray-300 p-3 my-4 bg-gray-300 rounded">
                                        <p className="text-sm font-semibold">(Ticket details will be set to email
                                            <span className='mx-1'>{bookingData?.user?.email}</span>
                                            and registered mobile number
                                            <span className='mx-1'>{bookingData?.user?.phoneno}</span>)
                                        </p>
                                    </div>

                                    <div className="md:hidden border border-gray-400 my-4">
                                        <h2 className="font-bold text-xl p-2 bg-gray-300">Fare Summary</h2>
                                        <div className="flex justify-between p-3 font-semibold text-sm text-gray-500">
                                            <p>Ticket Fare</p>
                                            <p className="font-bold text-gray-600">&#8377; {bookingData?.totalFare}.00</p>
                                        </div>
                                        <div className="flex justify-between p-3 font-semibold text-sm text-gray-500">
                                            <p>Convenience Fee (Incl.of GST)</p>
                                            <p className="font-bold text-gray-600">&#8377; {(bookingData?.totalFare / 100 * bookingData?.train?.tax_percent).toFixed(2)}</p>
                                        </div>
                                        <div
                                            className="flex justify-between p-3 font-semibold text-sm bg-blue-950 text-white">
                                            <p>Total Fare</p>
                                            <p className="font-bold">&#8377; {totalFare}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <Link to={"/ticket/book/passengers"}
                                            className="px-6 py-2 border border-gray-500 bg-gray-200 rounded mx-2 font-semibold">Back</Link>
                                        <button onClick={handleSubmit}
                                            className="px-6 py-2 border bg-orange-500 text-white rounded font-semibold">Continue</button>
                                    </div>
                                </div>

                                <div className="hidden md:block w-1/5 p-2 pt-4">
                                    <article className="border border-gray-500">
                                        <h2 className="font-bold text-xl p-2 bg-gray-300">Fare Summary</h2>
                                        <div className="flex justify-between p-3 font-semibold text-sm text-gray-500">
                                            <p>Ticket Fare</p>
                                            <p className="font-bold text-gray-600">&#8377; {bookingData?.totalFare?.toFixed(2)}</p>
                                        </div>
                                        <div className="flex justify-between p-3 font-semibold text-sm text-gray-500">
                                            <p>Convenience Fee <br />(Incl.of GST)</p>
                                            <p className="font-bold text-gray-600">&#8377; {(bookingData?.totalFare / 100 * bookingData?.train?.tax_percent).toFixed(2)}</p>
                                        </div>
                                        <div
                                            className="flex justify-between p-3 font-semibold text-sm bg-blue-950 text-white">
                                            <p>Total Fare</p>
                                            <p className="font-bold">&#8377; {totalFare}</p>
                                        </div>
                                    </article>
                                </div>
                            </div>

                        </div>
                    </main>
            }
        </>
    )
}

export default ReviewJourney