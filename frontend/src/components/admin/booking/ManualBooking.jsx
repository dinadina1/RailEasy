import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../layout/AdminSidebar';
import Loader from '../../layout/Loader';
import MetaData from '../../layout/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { getAllTrains } from '../../../actions/trainAction'
import { getAllBookings, manualBooking } from '../../../actions/bookingAction'
import { clearBookingError, clearIsBookingCreated } from '../../../slices/bookingSlice';

const ManualBooking = ({ setBgImage }) => {

    const dispatch = useDispatch();

    const { loading } = useSelector(state => state.authState);
    const { trains } = useSelector(state => state.trainState);
    const { bookings, error, isCreated, booking } = useSelector(state => state.bookingState);

    const [trainList, setTrainList] = useState([]);
    const [trainId, setTrainId] = useState('');
    const [stationList, setStationList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)

    // function to generate passenger seat numbers
    const generateSeatNumbers = (passengerList, date, trainId, classId) => {
        const bookingsForDate = bookings.filter((book) => {
            return new Date(book.date_of_journey).toString() === new Date(date).toString() && trainId.toString() === book.train._id.toString() && classId.toString() === book.class._id.toString();
        });

        if (bookingsForDate.length <= 0) {
            let seatNo = 1;
            let updatedPassengers = [];
            let seatsList = [];
            passengerList?.forEach(pass => {
                updatedPassengers = [...updatedPassengers, { ...pass, seat_number: `S${seatNo.toString().padStart(3, '0')}`, status: 'Confirmed' }];
                seatsList = [...seatsList, `S${seatNo.toString().padStart(3, '0')}`];
                seatNo++;
            });
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
        passengerList?.forEach(pass => {
            updatedPassengers = [...updatedPassengers, { ...pass, seat_number: `S${seatNo.toString().padStart(3, '0')}`, status: 'Confirmed' }];
            seatsList = [...seatsList, `S${seatNo.toString().padStart(3, '0')}`];
            seatNo++;
        });
        return updatedPassengers;
    }

    // formik form
    const formik = useFormik({
        initialValues: {
            train: '',
            trainName: '',
            date_of_journey: '',
            from_station: '',
            to_station: '',
            boarding_station: '',
            reservation_upto: '',
            departure_time: '',
            arrival_time: '',
            passengers: [],
            class: '',
            fare: '',
            total_fare: '',
            contact: [],
            email: '',
            phone_no: '',
            name: '',
            age: '',
            berth: '',
            gender: ''
        },
        validate: values => {
            const errors = {};
            if (!values.trainName) {
                errors.trainName = 'Required';
            }
            if (!values.date_of_journey) {
                errors.date_of_journey = 'Required';
            }
            if (!values.from_station) {
                errors.from_station = 'Required';
            }
            if (!values.to_station) {
                errors.to_station = 'Required';
            }
            if (!values.date_of_journey) {
                errors.date_of_journey = 'Required';
            }
            if (!values.class) {
                errors.class = 'Required';
            }
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid Email';
            }
            if (!values.phone_no) {
                errors.phone_no = 'Required';
            } else if (values.phone_no.length !== 10) {
                errors.phone_no = 'Invalid Phone Number';
            }
            return errors;
        },
        onSubmit: values => {
            values.passengers = generateSeatNumbers(values.passengers, values.date_of_journey, values.train, values.class);

            // calculate total fare
            let totalFare = 0;
            values.passengers.forEach(pass => {
                totalFare += values.fare;
            });
            const tax = (totalFare / 100 * 0.5.toFixed())

            const formData = {
                train: values.train,
                date_of_journey: values.date_of_journey,
                from_station: values.from_station,
                to_station: values.to_station,
                boarding_station: values.from_station,
                reservation_upto: values.to_station,
                departure_time: values.departure_time,
                arrival_time: values.arrival_time,
                passengers: values.passengers,
                class: values.class,
                total_fare: totalFare + tax,
                contact: {
                    phone_no: `+91${values.phone_no}`,
                    email: values.email
                },
                booking_status: "Confirmed",
                payment_status: "Success"
            }
            // dispatch action
            dispatch(manualBooking(formData));
        }
    })

    // function to handle trainList
    const handleTrainList = (e) => {
        let query = e.target.value.toLowerCase()
        if (query) {
            const trainList = trains?.filter(train => train.name.toLowerCase().includes(query));
            setTrainList(trainList);
        } else {
            setTrainList([]);
        }
    }

    // function to handle train change
    const handleTrainChange = (id, name) => {
        setTrainId(id);
        formik.setFieldValue('train', id);
        formik.setFieldValue('trainName', name);
        setTrainList([]);
    }

    // function to add passengers
    const handlePassengerList = () => {
        const { name, age, gender, berth, passengers } = formik.values;

        // Validation checks
        if (!name) {
            return toast.error('Please enter passenger name');
        } else if (!age) {
            return toast.error('Please enter passenger age');
        } else if (!gender) {
            return toast.error('Please enter passenger gender');
        } else if (!berth) {
            return toast.error('Please enter passenger berth');
        }

        // Create passenger data object
        const newPassenger = {
            name,
            age,
            gender,
            berth
        };

        // Check if passenger already exists by name
        const isExist = passengers?.find(pass => pass.name === name);

        if (isExist) {
            // Replace the existing passenger with updated details
            const filtered = passengers?.filter(pass => pass.name !== name);
            formik.setFieldValue('passengers', [...filtered, newPassenger]);
        } else {
            // Add new passenger to the list
            formik.setFieldValue('passengers', [...passengers, newPassenger]);
        }

        // Clear the individual fields after adding the passenger
        formik.setFieldValue('name', '');
        formik.setFieldValue('age', '');
        formik.setFieldValue('gender', '');
        formik.setFieldValue('berth', '');
    };


    // function to remove passenger
    const removePassengerFromList = (name) => {
        const updatedPassengerList = formik.values.passengers.filter((pass) => pass.name !== name);
        formik.setFieldValue('passengers', [...updatedPassengerList]);
    }

    // function to edit passenger
    const editPassengerFromList = (name) => {
        const passenger = formik.values.passengers.find((pass) => pass.name === name);
        formik.setFieldValue('name', passenger.name);
        formik.setFieldValue('age', passenger.age);
        formik.setFieldValue('gender', passenger.gender);
        formik.setFieldValue('berth', passenger.berth);
    }

    const departureTime = booking?.train?.route?.find(stat => stat.station === booking.from_station._id);
    const arrivalTime = booking?.train?.route?.find(stat => stat.station === booking.to_station._id);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearBookingError());
        }
        if (isCreated) {
            toast.success('Ticket booked success');
            dispatch(clearIsBookingCreated());
            formik.resetForm();
            setIsModalOpen(true)
        }
    }, [error, isCreated]);

    useEffect(() => {
        const train = trains.find(train => train._id === trainId);
        const stationList = train?.route.map(stat => {
            return {
                id: stat.station._id,
                name: stat.station.name,
                departure_time: stat.departure_time,
                arrival_time: stat.arrival_time
            }
        });
        setStationList(stationList);

        setClassList(train?.class)

    }, [trainId]);

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getAllTrains);
        dispatch(getAllBookings)
    }, []);

    return (
        <>
            <MetaData title={"Manual Booking"} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        <div id="main" className="w-full lg:w-5/6 md:p-8 bg-gray-100 h-screen overflow-y-auto">
                            <div className=" w-full bg-blue-950 p-3 text-center mb-3 text-white px-6">
                                <h2 className="text-xl font-bold ">Book Manual Ticket</h2>
                            </div>

                            <div className="container mx-auto p-2 md:p-4">
                                {/* <!-- Book Manual Ticket Form --> */}
                                <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded-lg p-6">

                                    {/* <!-- Train Details --> */}
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-700 mb-2">Train Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="search_train" className="block text-gray-700 font-medium mb-1">Search
                                                    Train</label>
                                                <input type="search" id="search_train" placeholder="Search or Enter train name"
                                                    name='trainName'
                                                    onChange={(e) => { formik.handleChange(e); handleTrainList(e) }}
                                                    value={formik.values.trainName}
                                                    onBlur={formik.handleBlur}
                                                    className="w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600" />
                                                {/* display error if trainName is invalid */}
                                                {
                                                    formik.errors.trainName && formik.touched.trainName ? (
                                                        <span className="text-red-500 text-sm flex gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                            </svg>
                                                            <span className='my-auto'>{formik.errors.trainName}</span>
                                                        </span>
                                                    ) : null
                                                }
                                                {
                                                    trainList?.length > 0 && (
                                                        <ul className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                                                            {
                                                                trainList.map((train, index) => (
                                                                    <li key={index} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white" onClick={() => handleTrainChange(train._id, train.name)}>
                                                                        {train.name}
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    )
                                                }
                                            </div>

                                            <div>
                                                <label htmlFor="from_station" className="block text-gray-700 font-medium mb-1">Select From
                                                    Station</label>
                                                <select id="from_station"
                                                    name='from_station' onChange={(e) => {
                                                        formik.handleChange(e);
                                                        const selectedStation = stationList.find(station => station.id === e.target.value);
                                                        if (selectedStation) {
                                                            formik.setFieldValue('departure_time', selectedStation.departure_time);
                                                        }
                                                    }} onBlur={formik.handleBlur} value={formik.values.from_station}
                                                    className="w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600">
                                                    <option value="" defaultValue={true}>--Select station--</option>
                                                    {
                                                        stationList?.length > 0 ? stationList.map((station, index) => (
                                                            <option key={index} value={station.id}>{station.name}</option>
                                                        )) :
                                                            <option >Search Train first</option>
                                                    }
                                                </select>
                                                {/* display error if from_station is invalid */}
                                                {
                                                    formik.errors.from_station && formik.touched.from_station ? (
                                                        <span className="text-red-500 text-sm flex gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                            </svg>
                                                            <span className='my-auto'>{formik.errors.from_station}</span>
                                                        </span>
                                                    ) : null
                                                }
                                            </div>
                                            <div>
                                                <label htmlFor="to_station" className="block text-gray-700 font-medium mb-1">Select To
                                                    Station</label>
                                                <select id="to_station"
                                                    name='to_station' onChange={(e) => {
                                                        formik.handleChange(e);
                                                        const selectedStation = stationList.find(station => station.id === e.target.value);
                                                        if (selectedStation) {
                                                            formik.setFieldValue('arrival_time', selectedStation.arrival_time);
                                                        }
                                                    }} onBlur={formik.handleBlur} value={formik.values.to_station}
                                                    className="w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600">
                                                    <option value="" defaultValue={true}>--Select station--</option>
                                                    {
                                                        stationList?.length > 0 ? stationList.map((station, index) => (
                                                            <option key={index} value={station.id}>{station.name}</option>
                                                        )) :
                                                            <option >Search Train first</option>
                                                    }
                                                </select>
                                                {/* display error if to_station is invalid */}
                                                {
                                                    formik.errors.to_station && formik.touched.to_station ? (
                                                        <span className="text-red-500 text-sm flex gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                            </svg>
                                                            <span className='my-auto'>{formik.errors.to_station}</span>
                                                        </span>
                                                    ) : null
                                                }
                                            </div>
                                            <div>
                                                <label htmlFor="departure_date" className="block text-gray-700 font-medium ">Departure
                                                    Date</label>
                                                <input type="date" id="departure_date"
                                                    name='date_of_journey' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.date_of_journey}
                                                    className="w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600" />
                                                {/* display error if date_of_journey is invalid */}
                                                {
                                                    formik.errors.date_of_journey && formik.touched.date_of_journey ? (
                                                        <span className="text-red-500 text-sm flex gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                            </svg>
                                                            <span className='my-auto'>{formik.errors.date_of_journey}</span>
                                                        </span>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="py-2 border-gray-500" />
                                    {/* <!-- Passenger Information --> */}
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-700 mb-2">Passenger Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="passanger_name"
                                                    className="block text-gray-700 font-medium mb-1">Name</label>
                                                <input id="passanger_name" type="text" placeholder="Enter passenger's name"
                                                    name='name' onChange={formik.handleChange} value={formik.values.name} onBlur={formik.handleBlur}
                                                    className="w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600" />
                                            </div>
                                            <div>
                                                <label htmlFor="age" className="block text-gray-700 font-medium mb-1">Age</label>
                                                <input id="age" type="number" placeholder="Enter passenger's age"
                                                    name='age' onChange={formik.handleChange} value={formik.values.age} onBlur={formik.handleBlur}
                                                    className="w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600" />
                                            </div>
                                            <div>
                                                <label htmlFor="gender" className="block text-gray-700 font-medium mb-1">Gender</label>
                                                <select id="gender"
                                                    name='gender' onChange={formik.handleChange} value={formik.values.gender} onBlur={formik.handleBlur}
                                                    className="w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600">
                                                    <option value="" defaultValue={true}>--Select Gender--</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="berth" className="block text-gray-700 font-medium mb-1">Select Berth</label>
                                                <select id="berth"
                                                    name='berth' onChange={formik.handleChange} value={formik.values.berth} onBlur={formik.handleBlur}
                                                    className="w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600">
                                                    <option value="" default>--select--</option>
                                                    <option value="lower">Lower Berth</option>
                                                    <option value="middle">Middle Berth</option>
                                                    <option value="upper">Upper Berth</option>
                                                    <option value="side_lower">Side Lower</option>
                                                    <option value="side_upper">Side Upper</option>
                                                </select>
                                            </div>
                                            {
                                                formik?.values?.passengers?.length > 0 && (
                                                    <ul className="flex gap-2 p-2 flex-wrap">
                                                        {
                                                            formik?.values?.passengers.map((pass, index) => {
                                                                return <li key={index} className="w-fit">
                                                                    <div onClick={() => removePassengerFromList(pass.name)}
                                                                        className="flex justify-end text-red-500 cursor-pointer font-semibold hover:text-red-600">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                                            strokeWidth="1.5" stroke="currentColor" className="size-4 ">
                                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                                d="M6 18 18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </div>
                                                                    <p onClick={() => editPassengerFromList(pass.name)}
                                                                        className="text-blue-500 font-semibold border px-2 w-fit rounded border-blue-500 cursor-pointer hover:bg-blue-100">
                                                                        {pass?.name}</p>
                                                                </li>
                                                            })
                                                        }
                                                    </ul>
                                                )
                                            }
                                            <div className="flex items-center p-4">
                                                <button type='button' onClick={handlePassengerList}
                                                    className="py-2 px-5 border rounded bg-orange-500 text-white font-semibold hover:bg-orange-600">Add
                                                    Passenger</button>
                                            </div>

                                        </div>
                                    </div>


                                    <hr className="py-2 border-gray-500" />

                                    {/* <!-- Ticket Options --> */}
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-700 mb-2">Ticket Options</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="className" className="block text-gray-700 font-medium mb-1">Select Class</label>
                                                <select id="className"
                                                    name='class' onChange={(e) => {
                                                        formik.handleChange(e);
                                                        const selectedClass = classList.find(cls => cls._id === e.target.value);
                                                        if (selectedClass) {
                                                            formik.setFieldValue('fare', selectedClass.fare);
                                                        }
                                                    }} onBlur={formik.handleBlur} value={formik.values.class}
                                                    className="w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600">
                                                    <option value="" defaultValue={true}>--Select class--</option>
                                                    {
                                                        classList?.length > 0 && (
                                                            classList.map((cls, index) => <option key={index} value={cls?._id}>{cls?.name}</option>)
                                                        )
                                                    }
                                                </select>
                                                {/* display error if class is invalid */}
                                                {
                                                    formik.errors.class && formik.touched.class ? (
                                                        <span className="text-red-500 text-sm flex gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                            </svg>
                                                            <span className='my-auto'>{formik.errors.class}</span>
                                                        </span>
                                                    ) : null
                                                }
                                            </div>
                                            <div>
                                                <label htmlFor="contact" className="block text-gray-700 font-medium mb-1">Contact
                                                    Number</label>
                                                <input id="contact" type="tel"
                                                    name='phone_no' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone_no}
                                                    className="w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600"
                                                    placeholder="Enter your contact number" />
                                                {/* display error if phone_no is invalid */}
                                                {
                                                    formik.errors.phone_no && formik.touched.phone_no ? (
                                                        <span className="text-red-500 text-sm flex gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                            </svg>
                                                            <span className='my-auto'>{formik.errors.phone_no}</span>
                                                        </span>
                                                    ) : null
                                                }
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
                                                <input id="email" type="email"
                                                    name='email' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                                                    className="w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600"
                                                    placeholder="Enter your email " />
                                                {/* display error if email is invalid */}
                                                {
                                                    formik.errors.email && formik.touched.email ? (
                                                        <span className="text-red-500 text-sm flex gap-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                            </svg>
                                                            <span className='my-auto'>{formik.errors.email}</span>
                                                        </span>
                                                    ) : null
                                                }
                                            </div>

                                        </div>
                                    </div>

                                    {/* <!-- Submit Button --> */}
                                    <div className="mt-6 text-center">
                                        <button type='submit' onClick={formik.handleSubmit}
                                            className="w-fit bg-blue-900 text-white font-semibold px-4 py-2 rounded-md shadow-sm hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            Book Ticket
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {
                            isModalOpen && booking?._id && (
                                <div id="modal" className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                                    {/* Modal Wrapper to enable scrolling if necessary */}
                                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-y-auto p-6">
                                        <div className="flex justify-between items-center border-b pb-3">
                                            <h3 className="text-xl font-semibold text-gray-800">Booking Details</h3>
                                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Booking Information */}
                                        <div className="flex flex-col gap-4 p-3">
                                            <h4 className="text-lg font-semibold text-gray-700">Train Details</h4>
                                            <p><strong>Train Name:</strong> {booking?.train?.name} ({booking?.train?.train_number})</p>
                                            <p><strong>Date of Journey:</strong> {booking?.date_of_journey}</p>
                                            <p><strong>From Station:</strong> {booking?.from_station?.name}</p>
                                            <p><strong>To Station:</strong> {booking?.to_station?.name}</p>
                                            <p><strong>Departure Time:</strong> {departureTime?.departure_time}</p>
                                            <p><strong>Arrival Time:</strong> {arrivalTime?.arrival_time}</p>
                                            <p><strong>Class:</strong> {booking?.class?.name.toUpperCase()}</p>

                                            <h4 className="text-lg font-semibold text-gray-700">Passenger Information</h4>
                                            <ul className="list-disc ml-5">
                                                {
                                                    booking?.passengers?.length > 0 &&
                                                    booking?.passengers?.map((pass, index) => <li key={index}><strong>Name:</strong> {pass?.name}, <strong>Seat:</strong> {pass?.seat_number}, <strong>Berth:</strong> {pass?.berth}</li>)
                                                }
                                            </ul>

                                            <h4 className="text-lg font-semibold text-gray-700">Fare Details</h4>
                                            <p><strong>Total Fare:</strong> ₹{booking?.total_fare.toFixed(2)}</p>
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

export default ManualBooking