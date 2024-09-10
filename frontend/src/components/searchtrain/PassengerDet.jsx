import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getNames } from 'country-list';
import toast from 'react-hot-toast';
import MetaData from '../layout/MetaData';
import AdminSidebar from '../layout/AdminSidebar';
import Loader from '../layout/Loader';
import { useSelector } from 'react-redux';

const PassengerDet = ({ setBgImage }) => {

    const navigate = useNavigate();

    const { user, loading } = useSelector(state => state.authState);
    const [bookingData, setBookingData] = useState(localStorage.getItem('bookingData') ? JSON.parse(localStorage.getItem('bookingData')) : {});
    const [countriesList, setCountriesList] = useState(getNames());
    const [passengersList, setPassengersList] = useState(localStorage.getItem('passengersList') ? JSON.parse(localStorage.getItem('passengersList')) : [{ name: '', age: '', gender: '', country: '', berth: '' }]);

    const [fare, setFare] = useState(0);
    const [totalFare, setTotalFare] = useState(0);

    // function to add passenger inputs
    const addPassenger = () => {
        calculateFare();
        const list = passengersList.find((item) => {
            if (!item.name || !item.age || !item.country || !item.gender || !item.berth) {
                return item;
            };
        })
        if (list) {
            return toast.error("Please fill all passenger fields");
        }

        const newPassenger = {
            name: '',
            age: '',
            gender: '',
            country: '',
            berth: ''
        };
        const newPassengerList = [...passengersList, newPassenger];
        setPassengersList(newPassengerList);
        localStorage.setItem('passengersList', JSON.stringify(newPassengerList));
    };

    // function to remove passenger
    const removePassenger = (index) => {
        const newPassengerList = [...passengersList];
        newPassengerList.splice(index, 1);
        setPassengersList(newPassengerList);
        localStorage.setItem('passengersList', JSON.stringify(newPassengerList))
        calculateFare();
    }

    const calculateFare = () => {
        const distance = bookingData.to.distance - bookingData.from.distance;
        let fares = bookingData.train.base_fare * distance;
        fares = fares + bookingData.class.fare;
        setFare(fares)

        let totFare = 0;
        const isSet = passengersList.filter((pass) => {
            if (pass.name && pass.age && pass.country && pass.gender) {
                return totFare += fare;
            }
        })
        if (isSet.length) {
            setTotalFare(totFare);
        }
    }

    // function to mask email
    function maskEmail(email) {
        if (email.includes("@")) {
            const [localPart, domain] = email.split('@');
            const maskedLocalPart = localPart.slice(0, 4) + '*'.repeat(localPart.length - 4);
            const maskedDomain = domain.replace(/(?<=.).(?=.*\.)/g, '*');
            return maskedLocalPart + '@' + maskedDomain;
        } else {
            // masked mobile number
            return '*'.repeat(email.length - 4) + email.slice(-4);
        }
    };

    // function to handle submit
    const handleSubmit = () => {
        let passengerCount = 0;

        // Check if all required passenger fields are filled
        passengersList.forEach((pass) => {
            if (pass.name && pass.age && pass.country && pass.gender && pass.berth) {
                passengerCount++;
            }
        });

        // Check if no passenger is added
        if (passengerCount === 0) {
            return toast.error("Please add at least one passenger");
        }
        localStorage.setItem('passengersList', JSON.stringify(passengersList));

        // Check if the mobile number is entered
        if (!bookingData?.user?.phoneno) {
            return toast.error("Please enter your mobile number");
        }

        // Filter the passengers list to include only those with complete data
        const newPassengerList = passengersList.filter((pass) => {
            return pass.name && pass.age && pass.country && pass.gender && pass.berth;
        });

        // Create a new booking data object
        const newBookingData = {
            ...bookingData,
            passengers: [...newPassengerList],
            totalFare: totalFare
        };

        // Store the new booking data in localStorage
        localStorage.setItem('bookingData', JSON.stringify(newBookingData));

        // Ensure 'state' exists in localStorage, and add "3" if not already present
        const state = JSON.parse(localStorage.getItem('state')) || [];
        if (!state.includes("3")) {
            localStorage.setItem('state', JSON.stringify([...state, "1", "2"]));
        }

        // Navigate to the review journey page
        navigate('/ticket/book/reviewjourney');
    };

    useEffect(() => {
        setBgImage("bg-white");
    }, [])

    useEffect(() => {
        calculateFare();
        if (!localStorage.getItem('state')) {
            localStorage.setItem('state', JSON.stringify(["1"]));
        }
    }, [passengersList, fare, totalFare]);

    return (
        <>
            <MetaData title={"Passengers Details"} />
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
                                    <Link to={"/ticket/book/reviewjourney"} className="rounded-full mx-auto px-4 py-2 bg-gray-400 text-white font-bold my-3">2</Link>
                                    <p className="text-gray-600 text-xs md:text-sm font-semibold my-3">Review Journey</p>
                                </article>
                                <article className="text-center">
                                    <Link to={"/ticket/book/payment"} className="rounded-full mx-auto px-4 py-2 bg-gray-400 text-white font-bold my-3">3</Link>
                                    <p className="text-gray-600 text-xs md:text-sm font-semibold my-3">Payment</p>
                                </article>
                            </div>

                            {/* Booking Information */}
                            <div className="flex">
                                <div className="w-full md:w-4/5 p-1 md:p-4">
                                    <div className="border border-gray-500 rounded">
                                        <h1 className="font-bold text-xl p-1 bg-gray-300">{bookingData?.train?.name} ({bookingData?.train?.train_number})</h1>
                                        <div className="p-3 flex justify-between flex-wrap">
                                            <article>
                                                <p className="font-bold">{bookingData?.from?.departure_time} | {bookingData?.from?.station?.name?.toUpperCase()}</p>
                                                <p className="text-center font-semibold text-sm">{bookingData.departure_date}</p>
                                            </article>
                                            <article>
                                                --- <span className="font-semibold">{bookingData?.travel_duration}</span> ---
                                            </article>
                                            <article>
                                                <p className="font-bold">{bookingData?.to?.arrival_time} | {bookingData?.to?.station?.name?.toUpperCase()}</p>
                                                <p className="text-center font-semibold text-sm">{bookingData?.arrivalDate}</p>
                                            </article>
                                        </div>
                                        <p className="text-center font-semibold">{bookingData?.className?.toUpperCase()} | {bookingData?.category?.toUpperCase()}</p>

                                        <form className="p-3">
                                            <label className="font-bold" htmlFor="boarding">CHANGE</label><br />
                                            <select name="boarding" id="boarding"
                                                className="border border-gray-500 rounded p-2 w-full font-semibold text-gray-500 mt-2">
                                                <option value="">Boarding Station | CHENNAI EGMORE | Arrival: -- | Departure:
                                                    19:30 | Day: 1 | Boarding Date: 12 Aug 2024</option>
                                                <option value="">Boarding Station | CHENNAI EGMORE | Arrival: -- | Departure:
                                                    19:30 | Day: 1 | Boarding Date: 12 Aug 2024</option>
                                                <option value="">Boarding Station | CHENNAI EGMORE | Arrival: -- | Departure:
                                                    19:30 | Day: 1 | Boarding Date: 12 Aug 2024</option>
                                                <option value="">Boarding Station | CHENNAI EGMORE | Arrival: -- | Departure:
                                                    19:30 | Day: 1 | Boarding Date: 12 Aug 2024</option>
                                            </select>
                                        </form>
                                    </div>

                                    <div className="py-4">
                                        <ul className="border-l-4 border-red-400 p-3 text-xs font-semibold bg-orange-100">
                                            <li className="py-1">Note: Please submit full name of the passengers instead of initials.</li>
                                            <li className="py-1">Note: The ID card will be required during the journey.</li>
                                        </ul>
                                    </div>

                                    {/* Passenger Form */}
                                    <div className="border border-gray-300 p-3">
                                        <h1 className="text-2xl font-bold text-gray-800">Passenger Details</h1>

                                        <form className="flex justify-between flex-wrap text-gray-600">
                                            {
                                                passengersList.length > 0 && passengersList.map((passenger, index) => {
                                                    return <Fragment key={index}>
                                                        <input value={passenger.name} onChange={(e) => {
                                                            setPassengersList([...passengersList.slice(0, index), { ...passenger, name: e.target.value }, ...passengersList.slice(index + 1)])
                                                            calculateFare();
                                                        }} type="text" placeholder="Enter Name"
                                                            className="w-full md:w-auto my-1 md:my-0 text-gray-600 border-b-2 p-2 border-gray-400 outline-none bg-none focus:outline-none focus:border-gray-800" />
                                                        <input type="tel" value={passenger.age} onChange={(e) => {
                                                            setPassengersList([...passengersList.slice(0, index), { ...passenger, age: e.target.value }, ...passengersList.slice(index + 1)])
                                                            calculateFare();
                                                        }} placeholder="Enter Age"
                                                            className="w-full md:w-1/6 my-1 md:my-0 text-gray-600 border-b-2 p-2 border-gray-400 outline-none bg-none focus:outline-none focus:border-gray-800" />
                                                        <select value={passenger.gender} onChange={(e) => {
                                                            setPassengersList([...passengersList.slice(0, index), { ...passenger, gender: e.target.value }, ...passengersList.slice(index + 1)])
                                                            calculateFare();
                                                        }}
                                                            className="w-full md:w-auto my-1 md:my-0 border-b-2 p-2 text-gray-600 border-gray-400 outline-none bg-none focus:outline-none focus:border-gray-800">
                                                            <option value="" default>Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                        <select value={passenger.country} onChange={(e) => {
                                                            setPassengersList([...passengersList.slice(0, index), { ...passenger, country: e.target.value }, ...passengersList.slice(index + 1)])
                                                            calculateFare();
                                                        }}
                                                            className="w-full md:w-1/5 my-1 md:my-0 border-b-2 p-2 border-gray-400 outline-none bg-none focus:outline-none focus:border-gray-800">
                                                            <option value="" default>Select Country</option>
                                                            {
                                                                countriesList.length > 0 && countriesList.map((country, index) => {
                                                                    return <option key={index} value={country}>{country}</option>
                                                                })
                                                            }
                                                        </select>
                                                        <select value={passenger.berth} onChange={(e) => {
                                                            setPassengersList([...passengersList.slice(0, index), { ...passenger, berth: e.target.value }, ...passengersList.slice(index + 1)])
                                                            calculateFare();
                                                        }}
                                                            className="w-full md:w-auto my-1 md:my-0 border-b-2 p-2 border-gray-400 outline-none bg-none focus:outline-none focus:border-gray-800">
                                                            <option value="" default>Select Breath</option>
                                                            <option value="No Preferance">No Preferance</option>
                                                            <option value="Lower">Lower</option>
                                                            <option value="Middle">Middle</option>
                                                            <option value="Upper">Upper</option>
                                                            <option value="Side Lower">Side Lower</option>
                                                            <option value="Side Upper">Side Upper</option>
                                                        </select>

                                                        <span className="text-gray-600 font-bold my-auto ">
                                                            <svg onClick={() => removePassenger(index)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentcolor"
                                                                height="25" width="25" className='cursor-pointer hover:text-red-500'>
                                                                <path
                                                                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                                            </svg>
                                                        </span>
                                                    </Fragment>
                                                })
                                            }

                                        </form>

                                        <div className="  pt-6 text-blue-500 ">
                                            <div onClick={() => addPassenger()} className='flex gap-2 p-2 cursor-pointer font-semibold hover:bg-gray-300 w-fit border rounded'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                                    stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                <span>Add Passenger</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-gray-300 p-3 my-4">
                                        <h1 className="text-2xl font-bold text-gray-800">Contact Details</h1>
                                        <p className="text-sm font-semibold py-3">(Ticket details will be set to email
                                            <span className='mx-1'>{maskEmail(bookingData?.user?.email)}</span>
                                            and registered mobile number)

                                        </p>
                                        <input type="text" value={bookingData?.user?.phoneno} onChange={(e) => {
                                            setBookingData({ ...bookingData, user: { ...bookingData?.user, phoneno: e.target.value } })
                                        }} placeholder="Enter Your Phone no"
                                            className="text-gray-600 border-b-2 p-2 border-gray-400 outline-none bg-none focus:outline-none focus:border-gray-800" />
                                    </div>
                                </div>
                                <div className="hidden md:block w-1/5 border-gray-400 my-4">
                                    <h2 className="font-bold text-xl p-2 bg-gray-300">Fare Summary</h2>
                                    <div className="flex justify-between p-3 font-semibold text-sm text-gray-500">
                                        <p>Ticket Fare</p>
                                        <p className="font-bold text-gray-600">&#8377; {fare > 0 ? fare : 0}.00</p>
                                    </div>
                                    <div
                                        className="flex justify-between p-3 font-semibold text-sm bg-blue-950 text-white">
                                        <p>Total Fare</p>
                                        <p className="font-bold">&#8377; {totalFare > 0 ? totalFare : 0}.00</p>
                                    </div>
                                </div>

                            </div>
                            <div className="md:hidden w-full border-gray-400 my-4 px-3">
                                <h2 className="font-bold text-xl p-2 bg-gray-300">Fare Summary</h2>
                                <div className="flex justify-between p-3 font-semibold text-sm text-gray-500">
                                    <p>Ticket Fare</p>
                                    <p className="font-bold text-gray-600">&#8377; {fare > 0 ? fare : 0}.00</p>
                                </div>
                                <div
                                    className="flex justify-between p-3 font-semibold text-sm bg-blue-950 text-white">
                                    <p>Total Fare</p>
                                    <p className="font-bold">&#8377; {totalFare > 0 ? totalFare : 0}.00</p>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="px-6 py-2 border border-gray-500 bg-gray-200 rounded mx-2 font-semibold">Back</button>
                                <button onClick={handleSubmit}
                                    className="px-6 py-2 border bg-orange-500 text-white rounded font-semibold">Continue</button>
                            </div>
                        </div>
                    </main>
            }
        </>
    );
}

export default PassengerDet;
