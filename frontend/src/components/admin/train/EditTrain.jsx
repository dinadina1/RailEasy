import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../../layout/MetaData';
import Loader from '../../layout/Loader';
import AdminSidebar from '../../layout/AdminSidebar';
import { useFormik } from 'formik'
import { getAllStations } from '../../../actions/stationAction';
import { toast } from 'react-hot-toast'
import { clearIsTrainCreated, clearIsTrainUpdated, clearTrainError } from '../../../slices/trainSlice';
import { createNewTrain, getParticularTrain, updateParticularTrain } from '../../../actions/trainAction';
import { useNavigate, useParams } from 'react-router-dom';

// formik validation
const validate = (values) => {
    const errors = {};

    // Validate train name
    if (!values.name) {
        errors.name = 'Required';
    }

    // Validate train number
    if (!values.train_number) {
        errors.train_number = 'Required';
    } else if (isNaN(values.train_number)) {
        errors.train_number = 'Invalid train number';
    }

    // Validate train type
    if (!values.type) {
        errors.type = 'Required';
    }

    // Validate source station
    if (!values.source_station) {
        errors.source_station = 'Required';
    }

    // Validate destination station
    if (!values.destination_station) {
        errors.destination_station = 'Required';
    }

    // Validate base fare
    if (!values.base_fare) {
        errors.base_fare = 'Required';
    } else if (isNaN(values.base_fare)) {
        errors.base_fare = 'Invalid base fare';
    }

    // Validate day of operation
    if (!values.day_of_operation) {
        errors.day_of_operation = 'Required';
    } else if (values.day_of_operation.length <= 0) {
        errors.day_of_operation = 'At least one day of operation is required';
    }

    // Validate return day of operation
    if (!values.return_day_of_operation) {
        errors.return_day_of_operation = 'Required';
    } else if (values.return_day_of_operation.length <= 0) {
        errors.return_day_of_operation = 'At least one return day of operation is required';
    }

    return errors;
};

const EditTrain = ({ setBgImage }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { loading, user } = useSelector(state => state.authState);
    const { stations } = useSelector(state => state.stationState);
    const { error, isUpdated, loading: trainLoading, train } = useSelector(state => state.trainState);

    const [sourceStationList, setSourceStationList] = useState([]);
    const [destinationStationList, setDestinationStationList] = useState([]);
    const [routeStationList, setRouteStationList] = useState([]);
    const [returnRouteStationList, setReturnRouteStationList] = useState([]);

    // formik form
    const formik = useFormik({
        initialValues: {
            name: '',
            train_number: '',
            source_station: '',
            destination_station: '',
            sourceStationId: '',
            destinationStationId: '',

            route: [],
            station: '',
            stationId: '',
            route_number: '',
            arrival_time: '',
            departure_time: '',
            halt_time: '',
            distance: '',

            type: '',
            day_of_operation: [],
            return_day_of_operation: [],
            base_fare: '',

            facilities: '',
            class: [],
            className: '',
            classFare: '',
            totalSeats: '',
            amentities: [],


            return_route: [],
            returnStation: '',
            returnStationId: '',
            returnRoute_number: '',
            returnArrival_time: '',
            returnDeparture_time: '',
            returnHalt_time: '',
            returnDistance: '',
        },
        validate,
        onSubmit: values => {
            if (!values.class.length) {
                return toast.error('Please add atleast one class');
            }
            if (values.route.length < 2) {
                return toast.error('Please add atleast two route');
            }
            if (values.return_route.length < 2) {
                return toast.error('Please add atleast two return route');
            }

            // removing station name in route
            const route = values.route.map(route => {
                return {
                    station: route.stationId,
                    arrival_time: route.arrival_time,
                    departure_time: route.departure_time,
                    halt_time: route.halt_time,
                    distance: route.distance,
                    route_number: route.route_number,
                }
            })

            // removing station name in return route
            const return_route = values.return_route.map(route => {
                return {
                    station: route.returnStationId,
                    arrival_time: route.returnArrival_time,
                    departure_time: route.returnDeparture_time,
                    halt_time: route.returnHalt_time,
                    distance: route.returnDistance,
                    route_number: route.returnRoute_number,
                }
            })

            // formdata
            let formData = {
                name: values.name,
                train_number: values.train_number,
                source_station: values.sourceStationId,
                destination_station: values.destinationStationId,
                type: values.type,
                day_of_operation: values.day_of_operation,
                return_day_of_operation: values.return_day_of_operation,
                base_fare: values.base_fare,
                facilities: values.facilities,
                class: values.class,
                route,
                return_route,
            }

            dispatch(updateParticularTrain(id, formData));
        }
    })

    // function to handle change sourceStation
    const handleSourceStationChange = (id) => {
        const filteredStation = stations.find(station => station._id === id);
        if (filteredStation) {
            formik.setFieldValue('sourceStationId', filteredStation._id);
            formik.setFieldValue('source_station', filteredStation.name);
            setSourceStationList([]);
        }
    };

    // function to handle change destinationStation
    const handleDestinationStationChange = (id) => {
        const filteredStation = stations.find(station => station._id === id);
        if (filteredStation) {
            formik.setFieldValue('destinationStationId', filteredStation._id);
            formik.setFieldValue('destination_station', filteredStation.name);
            setDestinationStationList([]);
        }
    }

    // function to handle source station list
    const handleSourceStationList = (e) => {
        const filteredStation = stations.filter(station => station.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setSourceStationList(filteredStation);
    }

    // function to handle destination station list
    const handleDestinationStationList = (e) => {
        const filteredStation = stations.filter(station => station.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setDestinationStationList(filteredStation);
    }

    // Function to handle dayOfOperation
    const handleDayOfOperation = (e) => {
        const selectedDay = e.target.value;
        if (formik.values.day_of_operation.includes(selectedDay)) {
            const filteredDayOfOperation = formik.values.day_of_operation.filter(day => day !== selectedDay);
            formik.setFieldValue('day_of_operation', filteredDayOfOperation);
        } else {
            formik.setFieldValue('day_of_operation', [...formik.values.day_of_operation, selectedDay]);
        }
    }

    // Function to handle return dayOfOperation
    const handleReturnDayOfOperation = (e) => {
        const selectedDay = e.target.value;
        if (formik.values.return_day_of_operation.includes(selectedDay)) {
            const filteredReturnDayOfOperation = formik.values.return_day_of_operation.filter(day => day !== selectedDay);
            formik.setFieldValue('return_day_of_operation', filteredReturnDayOfOperation);
        } else {
            formik.setFieldValue('return_day_of_operation', [...formik.values.return_day_of_operation, selectedDay]);
        }
    }


    // function to handle classlist
    const handleClassList = () => {
        const { classFare, className, totalSeats, amentities } = formik.values;
        // add formik error if not available
        if (!classFare) {
            toast.error('Class Fare is required');
            return;
        } else if (isNaN(classFare)) {
            toast.error('Invalid class fare');
            return;
        }
        if (!className) {
            toast.error('Class Name is required');
            return;
        }
        if (!totalSeats) {
            toast.error('Total Seats is required');
            return;
        } else if (isNaN(totalSeats)) {
            toast.error('Invalid total seats');
            return;
        }
        if (!amentities) {
            toast.error('Amentities is required');
            return;
        } else if (amentities.length === 0) {
            toast.error('At least one amentity is required');
            return;
        }

        const isExist = formik.values.class.find(cls => cls.name.toLowerCase() === className.toLowerCase());

        if (isExist) {
            const filteredClass = formik.values.class.filter(cls => cls.name.toLowerCase() !== isExist.name.toLowerCase());
            const updateClass = {
                name: className,
                fare: classFare,
                total_seats: totalSeats,
                amentities: amentities
            };
            formik.setFieldValue('class', [...filteredClass, updateClass]);
        } else {
            // add new class
            const newClass = {
                name: className,
                fare: classFare,
                total_seats: totalSeats,
                amentities: amentities
            };
            formik.setFieldValue('class', [...formik.values.class, newClass]);
        }
        formik.setFieldValue('classFare', '');
        formik.setFieldValue('className', '');
        formik.setFieldValue('totalSeats', '');
        formik.setFieldValue('amentities', []);
    };

    // function to remove class in classlist
    const removeClassFromClasslist = (name) => {
        const filteredClass = formik.values.class.filter(cls => cls.name.toLowerCase() !== name.toLowerCase());
        formik.setFieldValue('class', filteredClass);
        formik.setFieldValue('classFare', '');
        formik.setFieldValue('className', '');
        formik.setFieldValue('totalSeats', '');
        formik.setFieldValue('amentities', []);
    }

    // function to edit class
    const editClass = (name) => {
        const clsData = formik.values.class.find(cls => cls.name.toLowerCase() === name.toLowerCase());
        formik.setFieldValue('className', clsData.name);
        formik.setFieldValue('classFare', clsData.fare);
        formik.setFieldValue('totalSeats', clsData.total_seats);
        formik.setFieldValue('amentities', clsData.amentities);
    }

    // function to handle amentities 
    const handleAmentities = (e) => {
        const selectedAmentity = e.target.value;
        if (formik.values.amentities.includes(selectedAmentity)) {
            const filtered = formik.values.amentities.filter(amentity => amentity !== selectedAmentity)
            formik.setFieldValue('amentities', filtered);
        } else {
            formik.setFieldValue('amentities', [...formik.values.amentities, selectedAmentity])
        }
    };

    // function to handle routelist
    const handlerouteList = (e) => {
        e.preventDefault();
        const { stationId, station, route_number, distance, departure_time, arrival_time, halt_time, route } = formik.values;

        // add error if not available
        if (!stationId) {
            toast.error('Station is required');
            return;
        }
        if (!route_number) {
            toast.error('Route number is required');
            return;
        } else if (isNaN(route_number)) {
            toast.error('Invalid route number');
            return;
        }
        if (!distance) {
            toast.error('Distance is required');
            return;
        } else if (isNaN(distance)) {
            toast.error('Invalid distance');
            return;
        }
        if (!departure_time) {
            toast.error('Departure time is required');
            return;
        }
        if (!arrival_time) {
            toast.error('Arrival time is required');
            return;
        }
        if (!halt_time) {
            toast.error('Halt time is required');
            return;
        }

        // check if station is already added
        const isExist = route.find(r => r.stationId === stationId);
        if (isExist) {
            const filteredRoute = route.filter(r => r.stationId !== isExist.stationId);
            const updateRoute = {
                station: isExist.station,
                stationId: isExist.stationId,
                route_number: route_number,
                distance: distance,
                departure_time: departure_time,
                arrival_time: arrival_time,
                halt_time: halt_time
            };
            formik.setFieldValue('route', [...filteredRoute, updateRoute]);
        } else {
            // add new route
            const newRoute = {
                station: station,
                stationId: stationId,
                route_number: route_number,
                distance: distance,
                departure_time: departure_time,
                arrival_time: arrival_time,
                halt_time: halt_time
            };
            formik.setFieldValue('route', [...route, newRoute]);
        }
        formik.setFieldValue('station', '');
        formik.setFieldValue('stationId', '');
        formik.setFieldValue('route_number', '');
        formik.setFieldValue('distance', '');
        formik.setFieldValue('departure_time', '');
        formik.setFieldValue('arrival_time', '');
        formik.setFieldValue('halt_time', '');
    }

    // function to handle routestation list
    const handleRouteStationList = (e) => {
        const filteredStation = stations.filter(station => station.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setRouteStationList(filteredStation);
    }

    // function to handle routestation change
    const handleRouteStationChange = (id) => {
        const filteredStation = stations.find(station => station._id === id);
        if (filteredStation) {
            formik.setFieldValue('stationId', filteredStation._id);
            formik.setFieldValue('station', filteredStation.name);
            setRouteStationList([]);
        }
    };

    // function to remove station from route
    const removeStationFromRoute = (id) => {
        const filteredRoute = formik.values.route.filter(route => route.stationId !== id);
        formik.setFieldValue('route', filteredRoute);
    }

    // function to edit station from route
    const editStationFromRoute = (id) => {
        const routeData = formik.values.route.find(route => route.stationId === id);
        formik.setFieldValue('stationId', routeData.stationId);
        formik.setFieldValue('route_number', routeData.route_number);
        formik.setFieldValue('distance', routeData.distance);
        formik.setFieldValue('departure_time', routeData.departure_time);
        formik.setFieldValue('arrival_time', routeData.arrival_time);
        formik.setFieldValue('halt_time', routeData.halt_time);
        formik.setFieldValue('station', routeData.station);
    }

    // function to handle return routelist
    const handleReturnRouteList = (e) => {
        e.preventDefault();
        const { returnStation, returnStationId, returnArrival_time, returnDeparture_time, returnDistance, returnHalt_time, returnRoute_number, return_route } = formik.values;
        // add error if not available
        if (!returnStationId) {
            toast.error('Return Station is required');
            return;
        }
        if (!returnRoute_number) {
            toast.error('Return Route number is required');
            return;
        } else if (isNaN(returnRoute_number)) {
            toast.error('Invalid return route number');
            return;
        }
        if (!returnDistance) {
            toast.error('Return Distance is required');
            return;
        } else if (isNaN(returnDistance)) {
            toast.error('Invalid return distance');
            return;
        }
        if (!returnDeparture_time) {
            toast.error('Return Departure time is required');
            return;
        }
        if (!returnArrival_time) {
            toast.error('Return Arrival time is required');
            return;
        }
        if (!returnHalt_time) {
            toast.error('Return Halt time is required');
            return;
        }

        // check if station is already added
        const isExist = return_route.find(r => r.returnStationId === returnStationId);
        if (isExist) {
            const filteredRoute = return_route.filter(r => r.returnStationId !== isExist.returnStationId);
            const updateRoute = {
                returnStation: isExist.returnStation,
                returnStationId: isExist.returnStationId,
                returnRoute_number: returnRoute_number,
                returnDistance: returnDistance,
                returnDeparture_time: returnDeparture_time,
                returnArrival_time: returnArrival_time,
                returnHalt_time: returnHalt_time
            };
            formik.setFieldValue('return_route', [...filteredRoute, updateRoute]);
        } else {
            // add new route
            const newRoute = {
                returnStation: returnStation,
                returnStationId: returnStationId,
                returnRoute_number: returnRoute_number,
                returnDistance: returnDistance,
                returnDeparture_time: returnDeparture_time,
                returnArrival_time: returnArrival_time,
                returnHalt_time: returnHalt_time
            };
            formik.setFieldValue('return_route', [...return_route, newRoute]);
        }
        formik.setFieldValue('returnStation', '');
        formik.setFieldValue('returnStationId', '');
        formik.setFieldValue('returnRoute_number', '');
        formik.setFieldValue('returnDistance', '');
        formik.setFieldValue('returnDeparture_time', '');
        formik.setFieldValue('returnArrival_time', '');
        formik.setFieldValue('returnHalt_time', '');
    }

    // function to handle return routestation list
    const handleReturnRouteStationList = (e) => {
        const filteredStation = stations.filter(station => station.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setReturnRouteStationList(filteredStation);
    }

    // function to handle return routestation change
    const handleReturnRouteStationChange = (id) => {
        const filteredStation = stations.find(station => station._id === id);
        if (filteredStation) {
            formik.setFieldValue('returnStationId', filteredStation._id);
            formik.setFieldValue('returnStation', filteredStation.name);
            setReturnRouteStationList([]);
        }
    };

    // function to remove station from return route
    const removeStationFromReturnRoute = (id) => {
        const filteredRoute = formik.values.return_route.filter(route => route.returnStationId !== id);
        formik.setFieldValue('return_route', filteredRoute);
    }

    // function to edit station from return route
    const editStationFromReturnRoute = (id) => {
        const routeData = formik.values.return_route.find(route => route.returnStationId === id);
        formik.setFieldValue('returnStationId', routeData.returnStationId);
        formik.setFieldValue('returnRoute_number', routeData.returnRoute_number);
        formik.setFieldValue('returnDistance', routeData.returnDistance);
        formik.setFieldValue('returnDeparture_time', routeData.returnDeparture_time);
        formik.setFieldValue('returnArrival_time', routeData.returnArrival_time);
        formik.setFieldValue('returnHalt_time', routeData.returnHalt_time);
        formik.setFieldValue('returnStation', routeData.returnStation);
    }

    // function to setFacilities
    const setFacilities = (e) => {
        const selectedFacility = e.target.value;
        if (formik.values.facilities.includes(selectedFacility)) {
            const filtered = formik.values.facilities.filter(fac => fac !== selectedFacility)
            formik.setFieldValue('facilities', filtered);
        } else {
            formik.setFieldValue('facilities', [...formik.values.facilities, selectedFacility])
        }
    }

    useEffect(() => {
        const route = train?.route.length && train?.route?.map(route => {
            return {
                station: route.station.name,
                stationId: route.station._id,
                route_number: route.route_number,
                distance: route.distance,
                departure_time: route.departure_time,
                arrival_time: route.arrival_time,
                halt_time: route.halt_time
            }
        })

        const return_route = train?.return_route.length && train?.return_route?.map(route => {
            return {
                returnStation: route.station.name,
                returnStationId: route.station._id,
                returnRoute_number: route.route_number,
                returnDistance: route.distance,
                returnDeparture_time: route.departure_time,
                returnArrival_time: route.arrival_time,
                returnHalt_time: route.halt_time
            }
        })

        formik.setFieldValue('name', train?.name);
        formik.setFieldValue('train_number', train?.train_number);
        formik.setFieldValue('type', train?.type);
        formik.setFieldValue('source_station', train?.source_station?.name);
        formik.setFieldValue('sourceStationId', train?.source_station?._id);
        formik.setFieldValue('destination_station', train?.destination_station?.name);
        formik.setFieldValue('destinationStationId', train?.destination_station?._id);
        formik.setFieldValue('facilities', train?.facilities);
        formik.setFieldValue('route', route);
        formik.setFieldValue('return_route', return_route);
        formik.setFieldValue('class', train?.class);
        formik.setFieldValue('day_of_operation', train?.day_of_operation);
        formik.setFieldValue('return_day_of_operation', train?.return_day_of_operation);
        formik.setFieldValue('base_fare', train?.base_fare);
    }, [train]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearTrainError());
        };
        if (isUpdated) {
            toast.success("Train updated successfully");
            formik.resetForm();
            dispatch(clearIsTrainUpdated());
            navigate(`/admin/train/${id}`);
        }
    }, [error, isUpdated]);

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getAllStations)
        dispatch(getParticularTrain(id));
    }, [dispatch, id]);

    return (
        <>
            <MetaData title={`Edit train-${id}`} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        <div id="main" className="w-full lg:w-5/6 md:p-8 bg-gray-100 h-screen overflow-y-auto">
                            <div className=" w-full bg-blue-950 p-3 text-center mb-3 text-white px-6">
                                <h2 className="text-xl font-bold ">Edit Train</h2>
                            </div>
                            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md ">
                                <form onSubmit={formik.handleSubmit}>
                                    {/* <!-- Train Information --> */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label htmlFor="trainName" className="block text-gray-700 font-semibold">Train Name</label>
                                            <input id="trainName" type="text"
                                                name='name'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.name}
                                                className="w-full border-b-2 p-2 border-gray-300 focus:border-gray-600 outline-none"
                                                placeholder="Enter train name" />
                                            {/* display message if train name is invalid */}
                                            {
                                                formik.errors.name && formik.touched.name ? (
                                                    <span className="text-red-500 text-sm flex gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                        </svg>
                                                        <span className='my-auto'>{formik.errors.name}</span>
                                                    </span>
                                                ) : null
                                            }
                                        </div>
                                        <div>
                                            <label htmlFor="trainNumber" className="block text-gray-700 font-semibold">Train Number</label>
                                            <input id="trainNumber" type="tel"
                                                name='train_number'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.train_number}
                                                className="w-full border-b-2 p-2 border-gray-300 focus:border-gray-600 outline-none"
                                                placeholder="Enter train number" />
                                            {/* display message if train number is invalid */}
                                            {
                                                formik.errors.train_number && formik.touched.train_number ? (
                                                    <span className="text-red-500 text-sm flex gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                        </svg>
                                                        <span className='my-auto'>{formik.errors.train_number}</span>
                                                    </span>
                                                ) : null
                                            }
                                        </div>
                                        <div>
                                            <label htmlFor="trainType" className="block text-gray-700 font-semibold">Train Type</label>
                                            <select id="trainType"
                                                name='type'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.type}
                                                className="w-full border-b-2 p-2 border-gray-300 focus:border-gray-600 outline-none">
                                                <option value="" defaultValue={true}>--Select Train Type--</option>
                                                <option value="Express">Express</option>
                                                <option value="Superfast">Superfast</option>
                                                <option value="Passenger">Passenger</option>
                                            </select>
                                            {/* display message if train type is invalid */}
                                            {
                                                formik.errors.type && formik.touched.type ? (
                                                    <span className="text-red-500 text-sm flex gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                        </svg>
                                                        <span className='my-auto'>{formik.errors.type}</span>
                                                    </span>
                                                ) : null
                                            }
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="sourceStation" className="block text-gray-700 font-semibold">Search Source
                                                Station</label>
                                            <input id="sourceStation" type="search"
                                                name='source_station'
                                                onChange={(e) => { formik.handleChange(e); handleSourceStationList(e) }}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.source_station}
                                                className="w-full border-b-2 p-2 border-gray-300 focus:border-gray-600 outline-none"
                                                placeholder="Search search station" />
                                            {/* display message if source station is invalid */}
                                            {
                                                formik.errors.source_station && formik.touched.source_station ? (
                                                    <span className="text-red-500 text-sm flex gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                        </svg>
                                                        <span className='my-auto'>{formik.errors.source_station}</span>
                                                    </span>
                                                ) : null
                                            }

                                            {/* source station list */}
                                            {
                                                sourceStationList.length > 0 &&
                                                <ul
                                                    className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                                                    {
                                                        sourceStationList.map((stat, index) => {
                                                            return <li key={index} onClick={() => handleSourceStationChange(stat._id)} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white">{stat.name.toUpperCase()}</li>
                                                        })
                                                    }
                                                </ul>
                                            }
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="destinationStation" className="block text-gray-700 font-semibold">Search
                                                Destination
                                                Station</label>
                                            <input id="destinationStation" type="search"
                                                name='destination_station'
                                                onChange={(e) => { formik.handleChange(e); handleDestinationStationList(e) }}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.destination_station}
                                                className="w-full p-2 border-b-2 border-gray-300 focus:border-gray-600 outline-none"
                                                placeholder="Search destination station" />
                                            {/* display message if destination station is invalid */}
                                            {
                                                formik.errors.destination_station && formik.touched.destination_station ? (
                                                    <span className="text-red-500 text-sm flex gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                        </svg>
                                                        <span className='my-auto'>{formik.errors.destination_station}</span>
                                                    </span>
                                                ) : null
                                            }

                                            {/* destination station list */}
                                            {
                                                destinationStationList.length > 0 &&
                                                <ul
                                                    className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                                                    {
                                                        destinationStationList.map((stat, index) => {
                                                            return <li key={index} onClick={() => handleDestinationStationChange(stat._id)} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white">{stat.name.toUpperCase()}</li>
                                                        })
                                                    }
                                                </ul>
                                            }
                                        </div>

                                        <div>
                                            <label htmlFor="classNameName" className="block text-gray-700 font-semibold">Base fare per
                                                km</label>
                                            <input id="classNameName" type="tel"
                                                name='base_fare'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.base_fare}
                                                className="w-full border-b-2 p-2 border-gray-300 focus:border-gray-600 outline-none"
                                                placeholder="Ex: 2" />
                                            {/* display message if base fare is invalid */}
                                            {
                                                formik.errors.base_fare && formik.touched.base_fare ? (
                                                    <span className="text-red-500 text-sm flex gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                        </svg>
                                                        <span className='my-auto'>{formik.errors.base_fare}</span>
                                                    </span>
                                                ) : null
                                            }
                                        </div>

                                        <div>
                                            <label htmlFor="runsOnWeek" className="block text-gray-700 font-semibold">Day of operation</label>
                                            <div className="flex space-x-3 p-2 flex-wrap">
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox"
                                                        name='runs_on_week'
                                                        value={"Mon"}
                                                        onChange={handleDayOfOperation}
                                                    />
                                                    <span className="ml-2">Mon</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Tue"}
                                                        onChange={handleDayOfOperation} />
                                                    <span className="ml-2">Tue</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Wed"}
                                                        onChange={handleDayOfOperation} />
                                                    <span className="ml-2">Wed</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Thu"}
                                                        onChange={handleDayOfOperation} />
                                                    <span className="ml-2">Thu</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Fri"}
                                                        onChange={handleDayOfOperation} />
                                                    <span className="ml-2">Fri</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Sat"}
                                                        onChange={handleDayOfOperation} />
                                                    <span className="ml-2">Sat</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Sun"}
                                                        onChange={handleDayOfOperation} />
                                                    <span className="ml-2">Sun</span>
                                                </label>

                                            </div>
                                            {/* display message if day_of_operation is invalid */}
                                            {
                                                formik.errors.day_of_operation && formik.touched.day_of_operation ? (
                                                    <span className="text-red-500 text-sm flex gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                        </svg>
                                                        <span className='my-auto'>{formik.errors.day_of_operation}</span>
                                                    </span>
                                                ) : null
                                            }
                                        </div>

                                        <div>
                                            <label htmlFor="runsOnWeek" className="block text-gray-700 font-semibold">Return day of operation</label>
                                            <div className="flex space-x-3 p-2 flex-wrap">
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Mon"}
                                                        onChange={handleReturnDayOfOperation} />
                                                    <span className="ml-2">Mon</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Tue"}
                                                        onChange={handleReturnDayOfOperation} />
                                                    <span className="ml-2">Tue</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Wed"}
                                                        onChange={handleReturnDayOfOperation} />
                                                    <span className="ml-2">Wed</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Thu"}
                                                        onChange={handleReturnDayOfOperation} />
                                                    <span className="ml-2">Thu</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Fri"}
                                                        onChange={handleReturnDayOfOperation} />
                                                    <span className="ml-2">Fri</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Sat"}
                                                        onChange={handleReturnDayOfOperation} />
                                                    <span className="ml-2">Sat</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="form-checkbox" value={"Sun"}
                                                        onChange={handleReturnDayOfOperation} />
                                                    <span className="ml-2">Sun</span>
                                                </label>

                                            </div>
                                            {/* display message if return_day_of_operation is invalid */}
                                            {
                                                formik.errors.return_day_of_operation && formik.touched.return_day_of_operation ? (
                                                    <span className="text-red-500 text-sm flex gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                        </svg>
                                                        <span className='my-auto'>{formik.errors.return_day_of_operation}</span>
                                                    </span>
                                                ) : null
                                            }
                                        </div>

                                    </div>


                                    <hr className="py-3 border-gray-600" />
                                    {/* <!-- classNamees --> */}
                                    <h3 className="text-xl font-bold mb-4">class</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label htmlFor="classNameName" className="block text-gray-700 font-semibold">class name</label>
                                            <select id="classNameName"
                                                name='className'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.className}
                                                className="w-full border-b-2 p-2 border-gray-300 focus:border-gray-600 outline-none">
                                                <option value="" default>-- Select class --</option>
                                                <option value="AC 3 Tier">Ac 3 Tier</option>
                                                <option value="AC 2 Tier">Ac 2 Tier</option>
                                                <option value="Sleeper">Sleeper</option>
                                                <option value="Second class">Second class</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="fare" className="block text-gray-700 font-semibold">class Fare</label>
                                            <input id="fare" type="tel"
                                                name='classFare'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.classFare}
                                                className="w-full border-b-2 p-2 border-gray-300 focus:border-gray-600 outline-none"
                                                placeholder="Enter fare amount" />
                                        </div>
                                        <div>
                                            <label htmlFor="totSeat" className="block text-gray-700 font-semibold">Total Seats</label>
                                            <input id="totSeat" type="number"
                                                name='totalSeats'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.totalSeats}
                                                className="w-full p-2 border-b-2 border-gray-300 focus:border-gray-600 outline-none"
                                                placeholder="Enter total seat" />
                                        </div>
                                        <div>
                                            <label htmlFor="amenities" className="block text-gray-700 font-semibold">Amenities</label>
                                            <div className="flex space-x-4 p-2 flex-wrap">
                                                <label className="flex items-center">
                                                    <input type="checkbox" checked={formik.values.amentities.includes("AC")} className="form-checkbox" value={"AC"} onChange={handleAmentities} />
                                                    <span className="ml-2">AC</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" checked={formik.values.amentities.includes("Sleeper")} className="form-checkbox" value={"Sleeper"} onChange={handleAmentities} />
                                                    <span className="ml-2">Sleeper</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" checked={formik.values.amentities.includes("Wifi")} className="form-checkbox" value={"Wifi"} onChange={handleAmentities} />
                                                    <span className="ml-2">WiFi</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" checked={formik.values.amentities.includes("Catering")} className="form-checkbox" value={"Catering"} onChange={handleAmentities} />
                                                    <span className="ml-2">Catering</span>
                                                </label>

                                            </div>
                                        </div>

                                        <div className="flex gap-2 flex-wrap w-full">
                                            {
                                                formik.values.class?.length > 0 && formik.values.class.map((cls, index) => {
                                                    return <article key={index} className="w-fit">
                                                        <div className="flex justify-end">
                                                            <svg onClick={() => removeClassFromClasslist(cls.name)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                                stroke-width="1.5" stroke="currentColor"
                                                                className="size-4 cursor-pointer hover:text-red-600">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    d="M6 18 18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                        <p onClick={() => editClass(cls.name)}
                                                            className="border rounded text-blue-700 font-semibold cursor-pointer border-blue-700 px-2">
                                                            {cls?.name}</p>
                                                    </article>
                                                })
                                            }
                                        </div>
                                        <div>
                                            <button onClick={handleClassList} type='button' className="text-white bg-orange-600 w-fit px-8 py-2 rounded font-semibold">Add
                                                class</button>
                                        </div>
                                    </div>

                                    <hr className="py-3 border-gray-600" />

                                    {/* <!-- Stations --> */}
                                    <h3 className="text-xl mb-4 font-bold">Route Stations</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        <div className="relative">
                                            <label htmlFor="stations" className="block text-gray-700 font-semibold">Search station</label>
                                            <input id="stations" type="search"
                                                name='station'
                                                onChange={(e) => { formik.handleChange(e); handleRouteStationList(e) }}
                                                value={formik.values.station}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Enter station name" />
                                            {
                                                routeStationList.length > 0 &&
                                                <ul
                                                    className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                                                    {
                                                        routeStationList.map((station, index) => {
                                                            return <p key={index} onClick={() => handleRouteStationChange(station._id)} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white">{station.name}</p>
                                                        })
                                                    }
                                                </ul>
                                            }
                                        </div>
                                        <div>
                                            <label htmlFor="distance" className="block text-gray-700 font-semibold">Distance from source
                                                station</label>
                                            <input id="distance" type="text"
                                                name='distance'
                                                onChange={formik.handleChange}
                                                value={formik.values.distance}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Ex: 20" />
                                        </div>
                                        <div>
                                            <label htmlFor="arrival" className="block text-gray-700 font-semibold">Arrival time</label>
                                            <input id="arrival" type="text"
                                                name='arrival_time'
                                                onChange={formik.handleChange}
                                                value={formik.values.arrival_time}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Ex: 19:00" />
                                        </div>
                                        <div>
                                            <label htmlFor="departure_time" className="block text-gray-700 font-semibold">Departure
                                                time</label>
                                            <input id="departure_time" type="text"
                                                name='departure_time'
                                                onChange={formik.handleChange}
                                                value={formik.values.departure_time}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Ex: 12:00" />
                                        </div>
                                        <div>
                                            <label htmlFor="halt_time" className="block text-gray-700 font-semibold">Halt time</label>
                                            <input id="halt_time" type="text"
                                                name='halt_time'
                                                onChange={formik.handleChange}
                                                value={formik.values.halt_time}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Ex: 02:00" />
                                        </div>
                                        <div>
                                            <label htmlFor="route_number" className="block text-gray-700 font-semibold">Route Number</label>
                                            <input id="route_number" type="text"
                                                name='route_number'
                                                onChange={formik.handleChange}
                                                value={formik.values.route_number}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Ex: 1" />
                                        </div>
                                        <div className="flex gap-2 flex-wrap w-full">
                                            {
                                                formik.values.route.length > 0 && formik.values.route.map((station, index) => {
                                                    return <article className="w-fit">
                                                        <div key={index} className="flex justify-end">
                                                            <svg onClick={() => removeStationFromRoute(station.stationId)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                                stroke-width="1.5" stroke="currentColor"
                                                                className="size-4 cursor-pointer hover:text-red-600">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    d="M6 18 18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                        <p onClick={() => editStationFromRoute(station.stationId)}
                                                            className="border rounded text-blue-700 font-semibold cursor-pointer border-blue-700 px-2">
                                                            {station?.station}</p>
                                                    </article>
                                                })
                                            }
                                        </div>
                                        <div>
                                            <button type='button' onClick={handlerouteList} className="text-white bg-orange-600 w-fit px-8 py-2 rounded font-semibold">Add
                                                Station
                                            </button>
                                        </div>
                                    </div>

                                    {/* <!--Return route Stations --> */}
                                    <h3 className="text-xl mb-4 font-bold">Return Route Stations</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        <div className="relative">
                                            <label htmlFor="returnstations" className="block text-gray-700 font-semibold">Search station</label>
                                            <input id="returnstations" type="search"
                                                name='returnStation'
                                                onChange={(e) => { formik.handleChange(e), handleReturnRouteStationList(e) }}
                                                value={formik.values.returnStation}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Enter station name" />
                                            {
                                                returnRouteStationList.length > 0 &&
                                                <ul
                                                    className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                                                    {
                                                        returnRouteStationList.map((station, index) => {
                                                            return <li key={index} onClick={() => handleReturnRouteStationChange(station._id)} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white">{station.name}</li>
                                                        })
                                                    }
                                                </ul>
                                            }
                                        </div>
                                        <div>
                                            <label htmlFor="returndistance" className="block text-gray-700 font-semibold">Distance from source
                                                station</label>
                                            <input id="returndistance" type="text"
                                                name='returnDistance'
                                                onChange={formik.handleChange}
                                                value={formik.values.returnDistance}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Ex: 20" />
                                        </div>
                                        <div>
                                            <label htmlFor="returnarrival" className="block text-gray-700 font-semibold">Arrival time</label>
                                            <input id="returnarrival" type="text"
                                                name='returnArrival_time'
                                                onChange={formik.handleChange}
                                                value={formik.values.returnArrival_time}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Ex: 19:00" />
                                        </div>
                                        <div>
                                            <label htmlFor="returndeparture_time" className="block text-gray-700 font-semibold">Departure
                                                time</label>
                                            <input id="returndeparture_time" type="text"
                                                name='returnDeparture_time'
                                                onChange={formik.handleChange}
                                                value={formik.values.returnDeparture_time}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Ex: 12:00" />
                                        </div>
                                        <div>
                                            <label htmlFor="returnhalt_time" className="block text-gray-700 font-semibold">Halt time</label>
                                            <input id="returnhalt_time" type="text"
                                                name='returnHalt_time'
                                                onChange={formik.handleChange}
                                                value={formik.values.returnHalt_time}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Ex: 02:00" />
                                        </div>
                                        <div>
                                            <label htmlFor="returnRoutenumber" className="block text-gray-700 font-semibold">Route Number</label>
                                            <input id="returnRoutenumber" type="text"
                                                name='returnRoute_number'
                                                onChange={formik.handleChange}
                                                value={formik.values.returnRoute_number}
                                                onBlur={formik.handleBlur}
                                                className="w-full border-b-2 border-gray-300 p-2 focus:border-gray-600 outline-none"
                                                placeholder="Ex: 1" />
                                        </div>
                                        <div className="flex gap-2 flex-wrap w-full">
                                            {
                                                formik.values.return_route.length > 0 && formik.values.return_route.map((station, index) => {
                                                    return <article key={index} className="w-fit">
                                                        <div className="flex justify-end">
                                                            <svg onClick={() => removeStationFromReturnRoute(station.returnStationId)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                                stroke-width="1.5" stroke="currentColor"
                                                                className="size-4 cursor-pointer hover:text-red-600">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    d="M6 18 18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                        <p onClick={() => editStationFromReturnRoute(station.returnStationId)}
                                                            className="border rounded text-blue-700 font-semibold cursor-pointer border-blue-700 px-2">
                                                            {station.returnStation}</p>
                                                    </article>
                                                })
                                            }
                                        </div>
                                        <div>
                                            <button type='button' onClick={handleReturnRouteList} className="text-white bg-orange-600 w-fit px-8 py-2 rounded font-semibold">Add
                                                Station
                                            </button>
                                        </div>
                                    </div>

                                    <hr className="py-3 border-gray-600" />
                                    {/* <!-- Facilities --> */}
                                    <h3 className="text-xl font-semibold mb-4">Facilities</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        <div className="flex space-x-4">

                                            <label className="flex items-center">
                                                <input type="checkbox" checked={formik.values.facilities.includes("Restroom")} onClick={setFacilities} value={"Restroom"} className="form-checkbox" />
                                                <span className="ml-2">Restroom</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* <!-- Submit Button --> */}
                                    <div className="text-center">
                                        <button type="submit" onClick={formik.handleSubmit}
                                            className="bg-blue-900 text-white font-semibold px-8 py-2 rounded-lg shadow hover:bg-blue-950 transition duration-300">
                                            {
                                                trainLoading ? (
                                                    <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                                                ) : <span >Update</span>
                                            }
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div >

                    </main >
                )
            }
        </>
    )
}

export default EditTrain