import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../../layout/MetaData';
import Loader from '../../layout/Loader';
import AdminSidebar from '../../layout/AdminSidebar';
import { Link, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { clearStationError } from '../../../slices/stationSlice';
import toast from 'react-hot-toast';
import { getStationById } from '../../../actions/stationAction';

const AdminStationSearch = ({ setBgImage }) => {

    const dispatch = useDispatch();

    const { loading, user } = useSelector(state => state.authState);
    const { stations, station, error, loading: stationLoading } = useSelector(state => state.stationState);
    const [stationList, setStationList] = useState([]);

    // formik form
    const formik = useFormik({
        initialValues: {
            stationName: "",
            stationId: ""
        },
        validate: values => {
            const errors = {};
            if (!values.stationName) {
                errors.stationName = "Station name is required";
            }
            return errors;
        },
        onSubmit: values => {
            console.log(values);

            dispatch(getStationById(values.stationId));
        }
    });

    // function to search station by station name or code
    const handleStationList = (e) => {
        const { value } = e.target;
        if (value) {
            const filteredStations = stations?.filter(station => {
                return station.name.toLowerCase().includes(value.toLowerCase()) || station.station_code.toLowerCase().includes(value.toLowerCase());
            });
            setStationList(filteredStations);
        } else {
            setStationList([]);
        }
    }

    //    function to set station name and id
    const handleStation = (id, name) => {
        formik.setFieldValue("stationName", name);
        formik.setFieldValue("stationId", id);
        setStationList([]);
    }

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearStationError());
        }
    }, [error]);

    useEffect(() => {
        setBgImage("bg-white");
    }, []);

    return (
        <>
            <MetaData title={"Search Station"} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        {/* <!-- main content --> */}
                        <div className="w-full bg-white shadow-xl h-screen overflow-y-auto">

                            <section className="p-2 md:p-6">
                                <div className=" w-full bg-blue-950 p-3 text-center mb-3 text-white px-6">
                                    <h2 className="text-xl font-bold ">Search Station</h2>
                                </div>

                                <form onSubmit={formik.handleSubmit} className="flex justify-center flex-wrap gap-6 my-5 w-full">
                                    <article className=" p-2 my-2 ">
                                        <label htmlFor="search_train" className="text-gray-500 text-sm font-semibold">Station Code or
                                            Name</label>
                                        <input type="search" id="search_train"
                                            name='stationName'
                                            onChange={(e) => { formik.handleChange(e); handleStationList(e) }}
                                            onBlur={formik.handleBlur} value={formik.values.stationName}
                                            className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                                            placeholder="Search station code or name" />
                                        {/* display error if stationName is invalid */}
                                        {
                                            formik.errors.stationName && formik.touched.stationName ? (
                                                <span className="text-red-500 text-sm flex gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                    </svg>
                                                    <span className='my-auto'>{formik.errors.stationName}</span>
                                                </span>
                                            ) : null
                                        }
                                        {
                                            stationList?.length > 0 && (
                                                <ul
                                                    className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                                                    {
                                                        stationList?.map(station => (
                                                            <li key={station.id} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white"
                                                                onClick={() => handleStation(station._id, station.name)}>
                                                                {station.name} ({station.station_code})
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            )
                                        }
                                    </article>

                                    <button type="submit" onClick={formik.handleSubmit}
                                        className=" my-auto w-40 h-10 border bg-orange-500 text-lg font-bold text-white rounded hover:bg-orange-600">
                                        {
                                            stationLoading ? (
                                                <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                                            ) : <span >Search</span>
                                        }
                                    </button>
                                </form>

                            </section>

                            {
                                station?._id && (
                                    <section className="p-2 md:p-6">
                                        {/* <!-- Train Overview --> */}
                                        <div className="flex justify-between mx-2 md:mx-8 ">
                                            <h3 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 ">{station?.name} - ({station?.station_code}) </h3>
                                            {/* <!-- Edit button --> */}
                                            <Link to={`/admin/station/edit/${station?._id}`}
                                                className="flex items-center bg-blue-600 text-white px-5 md:px-6 md:py-1 rounded-full shadow-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="M5 13l4 4H4v-3l1-1h4l4 4h5l5-5L12 3l-7 7L4 7v6H1v4h3l4 4h8l5-5" />
                                                </svg>
                                                <span className="hidden md:block">Edit</span>
                                            </Link>
                                        </div>

                                        <div className="m-2 md:m-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50">

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <p className="text-gray-700 p-1"><strong>Station Code:</strong> ({station?.station_code})</p>
                                                    <p className="text-gray-700 p-1"><strong>Station Name:</strong> {station?.name}</p>
                                                    <p className="text-gray-700 p-1"><strong>Platforms:</strong> {station?.total_platform}</p>
                                                </div>
                                                <div className="text text-gray-700 space-y-2">
                                                    <p><strong>City:</strong> {station?.city}</p>
                                                    <p><strong>State:</strong> {station?.state}</p>
                                                    <p><strong>Country:</strong> {station?.country}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <!-- Trains List --> */}
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                                                <thead>
                                                    <tr className="bg-blue-950 text-white uppercase text-sm leading-normal">
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Train Name</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Train Number</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Arrival Time</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Departure Time</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Halt Duration</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Platform Number</th>
                                                        <th className="py-2 md:py-3 px-2 md:px-4 text-left">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-600 text-sm font-semibold">
                                                    {
                                                        station?.trains?.length > 0 ? (
                                                            station?.trains?.map(train => {
                                                                let filtered = train?.route.find(route => route.station === station._id)
                                                                return <tr className="border-b border-gray-200 hover:bg-gray-100">
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{train?.name}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{train?.train_number}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{filtered?.arrival_time}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{filtered?.departure_time}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{filtered?.halt_time}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left">{filtered?.route_number}</td>
                                                                    <td className="py-2 md:py-3 px-2 md:px-4 text-left text-green-500">{station?.status}</td>
                                                                </tr>
                                                            })
                                                        ) : (
                                                            <tr className="border-b border-gray-200 hover:bg-gray-100">
                                                                <td colSpan={7} className="py-2 md:py-3 px-2 md:px-4 text-center p-2">No trains available</td>
                                                            </tr>
                                                        )
                                                    }

                                                </tbody>
                                            </table>
                                        </div>

                                    </section>
                                )
                            }

                        </div>
                    </main>
                )
            }
        </>
    )
}

export default AdminStationSearch