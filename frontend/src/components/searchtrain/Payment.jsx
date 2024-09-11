import { toast } from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookings } from "../../actions/bookingAction";
import useRazorPay from "react-razorpay";
import { useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import AdminSidebar from '../layout/AdminSidebar';
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';

const API_URL = "http://3.84.31.96:8000";
// Function to get the token from cookies
const getToken = () => {
  // const token = Cookies.get("token");
  // return token ? token : "";
  const token = localStorage.getItem("token");
  return token ? token : "";
};

const config = {
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
};

const Payment = ({ setBgImage }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Razorpay = useRazorPay();

  const {
    bookings = [],
    loading,
    error,
    booking = {},
  } = useSelector((state) => state.bookingState);
  const { user } = useSelector(state => state.authState);

  const [bookingData, setBookingData] = useState(
    localStorage.getItem("bookingData")
      ? JSON.parse(localStorage.getItem("bookingData"))
      : []
  );
  const [totalFare, setTotalFare] = useState(0);
  const [updatedPassengers, setUpdatedPassengers] = useState(null);
  const [seats, setSeats] = useState([]);
  const [bookingId, setBookingId] = useState(JSON.parse(localStorage.getItem("bookingId"))
    ? JSON.parse(localStorage.getItem("bookingId"))
    : null);
  const [successLoading, setSuccessLoading] = useState(false);

  // function to get adult count
  const getAdultCount = () => {
    let count = 0;
    bookingData?.passengers?.forEach((passenger) => {
      if (passenger.age >= 18) {
        count++;
      }
    });
    return count;
  };

  // function to get minor count
  const getMinorCount = () => {
    let count = 0;
    bookingData?.passengers?.forEach((passenger) => {
      if (passenger.age < 18) {
        count++;
      }
    });
    return count;
  };

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

  // function to handle payment
  const handlePayment = useCallback(async () => {

    try {
      // create razorpay order
      const orderResponse = await axios.post(`${API_URL}/api/v1/booking/payment/order`, {
        amount: totalFare,
        currency: "INR",
      }, config);

      if (!orderResponse.data.success) {
        return toast.error('Failed to create Razorpay order.');
      }

      const { order_id, amount, currency } = orderResponse.data;

      // initialize razorpay
      const options = {
        key: "rzp_test_WKQWXmsII9idvc",
        amount: amount,
        currency: currency,
        name: "RailEasy",
        description: "Train Ticket Payment",
        order_id: order_id,
        handler: async (response) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          const paymentData = {
            booking_id: bookingId,
            paymentId: razorpay_payment_id,
            order_id: razorpay_order_id,
            signature: razorpay_signature,
            amount: amount / 100,
            currency: currency,
            status: "Success",
            method: "razorpay"
          }

          try {
            setSuccessLoading(true);
            const completeResponse = await axios.post(`${API_URL}/api/v1/booking/payment/new`, paymentData, config);

            if (completeResponse.data.success) {
              toast.success("Payment successful! Ticket has been sent");
              localStorage.setItem('payment', JSON.stringify(completeResponse.data));
              navigate(`/ticket/book/payment/success/${bookingId}`);
            } else {
              setSuccessLoading(false)
              throw new Error('Payment completion failed.')
            }

          } catch (error) {
            setSuccessLoading(false);
            toast.error("Payment varification failed. Please contact support.")
          }
        },
        prefill: {
          name: "RailEasy",
          email: "support@raileasy.com",
          contact: "+91 1234567890"
        },
        notes: {
          booking_id: bookingId
        },
        theme: {
          color: "#3795BD"
        }
      };

      // open Razorpay window
      const rzp = new window.Razorpay(options);
      rzp.open();

      // handle payment failure
      rzp.on('payment.failed', (response) => {
        toast.error("Payment failed. Please try again.")
      })
    }
    catch (error) {
      console.error(error);
      toast.error("An error occurred during payment. Please try again.");
    }
  })


  useEffect(() => {
    setBgImage("bg-white");
    const state = JSON.parse(localStorage.getItem("state"));

    if (!state || !state.includes("2")) {
      return navigate("/ticket/book/passengers");
    } else if (!state.includes("3") && state.includes("2")) {
      return navigate("/ticket/book/reviewjourney");
    }
    dispatch(getBookings);
    const totFare =
      bookingData?.totalFare +
      (bookingData?.totalFare / 100) * bookingData?.train?.tax_percent;
    setTotalFare(totFare.toFixed(2));
  }, []);

  return (
    <>
      <MetaData title={"Payment"} />
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
                  <Link
                    to={"/ticket/book/passengers"}
                    className="rounded-full mx-auto px-4 py-2 bg-orange-500 text-white font-bold my-3"
                  >
                    1
                  </Link>
                  <p className="text-gray-600 text-xs md:text-sm font-semibold my-3">
                    Passenger Details
                  </p>
                </article>
                <article className="text-center">
                  <Link
                    to={"/ticket/book/reviewjourney"}
                    className="rounded-full mx-auto px-4 py-2 bg-orange-500 text-white font-bold my-3"
                  >
                    2
                  </Link>
                  <p className="text-gray-600 text-xs md:text-sm font-semibold my-3">
                    Review Journey
                  </p>
                </article>
                <article className="text-center">
                  <Link
                    to={"/ticket/book/payment"}
                    className="rounded-full mx-auto px-4 py-2 bg-orange-500 text-white font-bold my-3"
                  >
                    3
                  </Link>
                  <p className="text-gray-600 text-xs md:text-sm font-semibold my-3">
                    Payment
                  </p>
                </article>
              </div>

              <div className="flex ">
                <div className="hidden md:block w-full md:w-2/5 p-1 md:p-4">
                  <div className="border border-gray-500 rounded pb-3">
                    <h1 className="font-bold text-xl p-1 bg-gray-300">
                      {bookingData?.train?.name} ({bookingData?.train?.train_number})
                    </h1>
                    <div className="p-3 flex justify-between flex-wrap">
                      <article>
                        <p className="font-bold">
                          {bookingData?.from?.departure_time} |{" "}
                          {bookingData?.from?.station?.name}
                        </p>
                        <p className="text-center font-semibold text-sm">
                          {bookingData?.departure_date}
                        </p>
                      </article>
                      <article>
                        ---{" "}
                        <span className="font-semibold">
                          {bookingData?.travel_duration}
                        </span>{" "}
                        ---
                      </article>
                      <article>
                        <p className="font-bold">
                          {bookingData?.to?.arrival_time} |{" "}
                          {bookingData?.to?.station?.name}
                        </p>
                        <p className="text-center font-semibold text-sm">
                          {bookingData?.arrivalDate}
                        </p>
                      </article>
                    </div>
                    <article className="flex justify-center gap-2">
                      {seats.length > 0 &&
                        seats.map((seat, index) => {
                          return (
                            <p key={index} className="font-bold text-red-600">
                              {seat}
                            </p>
                          );
                        })}
                    </article>
                    <p className="font-bold text-sm border-1 w-fit rounded bg-gray-300 p-1 px-5 mx-auto my-2">
                      {getAdultCount() > 0 && getAdultCount() + "Adult"}
                      {getMinorCount() > 0 && " |" + getMinorCount() + "Minor"} |{" "}
                      {bookingData?.className?.toUpperCase()} (
                      {bookingData?.className?.toUpperCase().slice(0, 2)}) |{" "}
                      {bookingData?.category?.toUpperCase()} | Boarding at{" "}
                      {bookingData?.from?.station?.name} | Boarding Date:{" "}
                      {bookingData?.departure_date} {bookingData?.from?.departure_time}
                    </p>
                  </div>

                  <div className="border border-gray-300 p-3 py-2 my-4">
                    <h1 className="text-2xl font-bold text-gray-700">
                      Passenger Details
                    </h1>
                    {
                      bookingData?.passengers?.length > 0 && bookingData?.passengers.map((pass, index) => {
                        return <div key={index} className="text-gray-600 text-sm p-3">
                          <span className="font-bold text-md px-2 ">{index + 1}. {pass.name}</span>
                          {pass.age} yrs | {pass.gender} | {pass.country} | {pass.class}
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
                </div>

                <div className=" w-full md:w-3/5 p-2 pt-4">
                  <article className="border border-gray-500 ">
                    <h3 className="font-bold text-lg p-2 bg-blue-950 text-white">
                      Secure Payment with Razorpay
                    </h3>
                    <p className="text-gray-500 font-semibold p-2">
                      Our website accepts payments exclusively through Razorpay,
                      ensuring a secure and seamless transaction experience.
                    </p>
                    <h4 className="font-bold text-md p-2 text-gray-500">
                      Supported Payment Methods via Razorpay:
                    </h4>
                    <ul className="list-disc py-2 px-8 text-sm font-semibold text-gray-600">
                      <li>Credit/Debit Cards</li>
                      <li>UPI</li>
                      <li>Net Banking</li>
                      <li>Wallets (e.g., Paytm, PhonePe)</li>
                    </ul>
                  </article>
                  <article className="border border-gray-500 my-4">
                    <h2 className="font-bold text-xl p-2 bg-blue-950 text-white">
                      Fare Summary
                    </h2>
                    <div className="flex justify-between p-3 font-semibold text-sm text-gray-500">
                      <p>Ticket Fare</p>
                      <p className="font-bold text-gray-600">&#8377; {bookingData?.totalFare}.00</p>
                    </div>
                    <div className="flex justify-between p-3 font-semibold text-sm text-gray-500">
                      <p>Convenience Fee (Incl.of GST)</p>
                      <p className="font-bold text-gray-600">&#8377; {(bookingData?.totalFare / 100 * bookingData?.train?.tax_percent).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between p-3 font-bold text-md text-gray-800">
                      <p>Total Fare</p>
                      <p className="font-bold">&#8377; {totalFare}</p>
                    </div>
                    <div className="text-center my-2">
                      <button onClick={handlePayment} className="px-8 py-2 border bg-orange-500 text-white rounded font-semibold">
                        {successLoading ? "Please Wait..." : <span>Pay &#8377;
                          {totalFare} </span>
                        }
                      </button>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </main>
      }
    </>
  );
};

export default Payment;
