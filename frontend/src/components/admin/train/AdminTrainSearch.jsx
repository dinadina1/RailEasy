import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../../layout/MetaData';
import Loader from '../../layout/Loader';
import AdminSidebar from '../../layout/AdminSidebar';
import { useFormik } from 'formik'
import { getAllTrains, getParticularTrain } from '../../../actions/trainAction';
import { toast } from 'react-hot-toast'
import { clearTrainError } from '../../../slices/trainSlice';
import { Link } from 'react-router-dom';

const AdminTrainSearch = ({ setBgImage }) => {

    const dispatch = useDispatch();
    const { loading, user } = useSelector(state => state.authState);
    const { trains, loading: trainLoading, train = {}, error } = useSelector(state => state.trainState);

    const [trainList, setTrainList] = useState([]);

    // formik form
    const formik = useFormik({
        initialValues: {
            trainId: '',
            trainName: ''
        },
        validate: values => {
            const errors = {};
            if (!values.trainName) {
                errors.trainName = 'Required';
            }
            return errors;
        },
        onSubmit: values => {
            dispatch(getParticularTrain(values.trainId));
        }
    })

    // function to handle trainList
    const handleTrainList = (e) => {
        const filteredTrains = trains.filter(train => train.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setTrainList(filteredTrains);
    }

    // function to set trainid
    const handleTrainId = (id) => {
        const data = trains.find(train => train._id === id);
        formik.setFieldValue('trainId', data._id);
        formik.setFieldValue('trainName', data.name);
        setTrainList([]);
    }

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearTrainError());
        }
    }, [error]);

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getAllTrains);
    }, []);

    return (
        <>
            <MetaData title={"Search trains"} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        {/* <!-- main content --> */}
                        <div className="w-full bg-white rounded-xl shadow-xl h-screen overflow-y-auto">

                            <section className=" md:p-6">
                                <div className=" w-full bg-blue-950 p-3 text-center mb-3 text-white px-6">
                                    <h2 className="text-xl font-bold ">Search Train</h2>
                                </div>

                                <form onSubmit={formik.handleSubmit} className="flex justify-center flex-wrap gap-6 my-5 w-full">
                                    <article className=" md:p-2 my-2 relative">
                                        <label for="search_train" className="text-gray-500 text-sm font-semibold">Train Number or
                                            Name</label>
                                        <input type="search" id="search_train"
                                            name='trainName'
                                            onChange={(e) => { formik.handleChange(e); handleTrainList(e) }}
                                            value={formik.values.trainName}
                                            onBlur={formik.handleBlur}
                                            className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                                            placeholder="Search Train Number or Name" />
                                        {/* display message if train name is invalid */}
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
                                            trainList.length > 0 &&
                                            <ul
                                                className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                                                {
                                                    trainList.map((train, key) => (
                                                        <li key={key} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white" onClick={() => { handleTrainId(train._id) }}>{train.name}</li>
                                                    ))
                                                }
                                            </ul>
                                        }
                                    </article>

                                    <button type="submit" onClick={formik.handleSubmit}
                                        className=" my-auto px-16 py-2 border bg-orange-500 text-lg font-bold text-white rounded w-fit hover:bg-orange-600">
                                        {
                                            trainLoading ? (
                                                <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                                            ) : <span >Search</span>
                                        }
                                    </button>
                                </form>

                            </section>

                            {
                                train && train?._id && (
                                    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-auto">
                                        <div className="flex justify-end p-3">
                                            {/* <!-- Edit button --> */}
                                            <Link to={`/admin/train/edit/${train?._id}`}
                                                className="flex items-center bg-blue-600 text-white px-6 py-1 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M5 13l4 4H4v-3l1-1h4l4 4h5l5-5L12 3l-7 7L4 7v6H1v4h3l4 4h8l5-5" />
                                                </svg>
                                                Edit
                                            </Link>
                                        </div>

                                        {/* <!-- Header --> */}
                                        {/* <div className="text-gray-800 p-2 md:p-8">
                                            <h1 className="text-4xl font-bold">Train Details</h1>
                                        </div> */}

                                        {/* <!-- Train Overview --> */}
                                        <div className="m-2 md:m-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{train?.name}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-gray-700 p-1"><strong>Train Number:</strong> {train?.train_number}</p>
                                                    <p className="text-gray-700 p-1"><strong>Source:</strong> {train?.source_station?.name}</p>
                                                    <p className="text-gray-700 p-1"><strong>Destination:</strong> {train?.destination_station?.name}</p>
                                                </div>
                                                <div className="text text-gray-700 space-y-2">
                                                    <p><strong>Departure Time:</strong> {train?.route[0]?.departure_time}</p>
                                                    <p><strong>Arrival Time:</strong> {train?.route[train?.route.length - 1]?.arrival_time}</p>
                                                    <p><strong>Runs on:</strong>
                                                        {
                                                            train?.day_of_operation.length > 0 &&
                                                            train.day_of_operation.map((day, index) => <span key={index} className='mx-1'>{day}</span>)
                                                        }
                                                        {
                                                            train?.return_day_of_operation.length > 0 &&
                                                            train.return_day_of_operation.map((day, index) => <span key={index} className='mx-1'>{day}</span>)
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <!-- classNamees Section --> */}
                                        <div className="p-10 bg-white">
                                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Available classes</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                {
                                                    train?.class.length > 0 &&
                                                    train?.class.map((cls, index) => {
                                                        return <div key={index}
                                                            className="p-6 bg-blue-100 rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-1">
                                                            <h4 className="text-2xl font-bold text-orange-600 mb-4">{cls?.name} ({cls?.name.toUpperCase().slice(0, 2)})</h4>
                                                            <p className="text-gray-700 text-lg"><strong>Fare:</strong> &#8377;{cls?.fare}</p>
                                                            <p className="text-gray-700 text-lg"><strong>Total Seats:</strong> {cls?.total_seats}</p>
                                                            <p className="text-gray-700 text-lg"><strong>Amenities:</strong>
                                                                {
                                                                    cls?.amentities?.length > 0 &&
                                                                    cls.amentities.map((amenity, index) => <span key={index} className='mx-1'>{amenity}</span>)
                                                                }
                                                            </p>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>

                                        {/* <!-- Stations Section --> */}
                                        <div className="m-2 md:m-5 p-5 bg-gradient-to-r from-indigo-100 to-blue-100">
                                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Stations Covered</h3>
                                            <div className="bg-white p-6 rounded-lg shadow-md">
                                                <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
                                                    {
                                                        train?.route.length > 0 &&
                                                        train.route.map((station, index) => {
                                                            return <li key={index}>{station?.station?.name}</li>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>

                                        {/* <!-- Facilities Section --> */}
                                        <div className="p-10 bg-white">
                                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Facilities</h3>
                                            <div className="flex flex-wrap justify-around space-x-8 space-y-4">
                                                {
                                                    train?.facilities.length > 0 &&
                                                    train.facilities.map((facility, index) => {
                                                        return <div key={index}
                                                            className="flex items-center space-x-2">
                                                            <span className="text-indigo-600">
                                                                {/* <!-- Icon for the facility --> */}
                                                                <svg xmlns="XXXXXXXXXXXXXXXXXXXXXXXXXX" className="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                                        d="M9 12h6M9 16h6m-2 4a7 7 0 100-14 7 7 0 000 14z" />
                                                                </svg>
                                                            </span>
                                                            <span className="text-gray-700 text-lg">{facility}</span>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </main>
                )
            }
        </>
    )
}

export default AdminTrainSearch