import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../../layout/MetaData';
import Loader from '../../layout/Loader';
import AdminSidebar from '../../layout/AdminSidebar';
import { useFormik } from 'formik';
import { getNames } from 'country-list';
import { newStation } from '../../../actions/stationAction';
import toast from 'react-hot-toast';
import { clearIsStationCreated, clearStationError } from '../../../slices/stationSlice';

const CreateStation = ({ setBgImage }) => {

    const dispatch = useDispatch();

    const { loading } = useSelector(state => state.authState);
    const { error, isCreated, loading: stationLoading } = useSelector(state => state.stationState);

    // formik form
    const formik = useFormik({
        initialValues: {
            name: '',
            station_code: '',
            total_platform: '',
            city: '',
            state: '',
            country: ''
        },
        validate: values => {
            const errors = {};
            if (!values.name) {
                errors.name = 'Station name is required';
            }
            if (!values.station_code) {
                errors.station_code = 'Station code is required';
            } else if (values.station_code.length < 3) {
                errors.station_code = 'Station code must be at least 3 characters';
            }
            if (!values.total_platform) {
                errors.total_platform = 'Total platform is required';
            } else if (values.total_platform < 1) {
                errors.total_platform = 'Total platform must be greater than 0';
            } else if (isNaN(values.total_platform)) {
                errors.total_platform = 'Total platform must be a number';
            }
            if (!values.city) {
                errors.city = 'City is required';
            }
            if (!values.state) {
                errors.state = 'State is required';
            }
            if (!values.country) {
                errors.country = 'Country is required';
            }
            return errors;
        },
        onSubmit: (values) => {
            const formData = {
                name: values.name.toUpperCase(),
                station_code: values.station_code.toUpperCase(),
                total_platform: values.total_platform,
                city: values.city.toUpperCase(),
                state: values.state.toUpperCase(),
                country: values.country.toUpperCase()
            }
            dispatch(newStation(formData));
        }
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearStationError());
        }
        if (isCreated) {
            toast.success('Station created successfully');
            formik.resetForm();
            dispatch(clearIsStationCreated());
        }
    }, [error, isCreated]);

    useEffect(() => {
        setBgImage("bg-white");
    }, []);

    return (
        <>
            <MetaData title={"Create new station"} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        <main id="main" className="w-full lg:w-5/6 md:p-8 bg-gray-100 h-screen overflow-y-auto">
                            <div className=" w-full bg-blue-950 p-3 text-center mb-3 text-white px-6">
                                <h2 className="text-xl font-bold ">Register New Station</h2>
                            </div>
                            <div className="container mx-auto p-4 max-w-lg">
                                <form onSubmit={formik.handleSubmit}>
                                    {/* <!-- Station Name --> */}
                                    <div className="mb-4">
                                        <label htmlFor="station-name" className="block text-sm font-medium text-gray-700">
                                            Station Name
                                        </label>
                                        <input type="text" id="station-name" placeholder="Enter station name" name='name'
                                            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name}
                                            className="mt-1 w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600 bg-gray-100" />
                                        {/* display error if station name is invalid */}

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

                                    {/* <!-- Station Code --> */}
                                    <div className="mb-4">
                                        <label htmlFor="station-code" className="block text-sm font-medium text-gray-700">
                                            Station Code
                                        </label>
                                        <input type="text" id="station-code" placeholder="Enter station code" name='station_code'
                                            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.station_code}
                                            className="mt-1 w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600 bg-gray-100" />
                                        {/* display error if station_code is invalid */}

                                        {
                                            formik.errors.station_code && formik.touched.station_code ? (
                                                <span className="text-red-500 text-sm flex gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                    </svg>
                                                    <span className='my-auto'>{formik.errors.station_code}</span>
                                                </span>
                                            ) : null
                                        }
                                    </div>
                                    {/* <!-- Platform --> */}
                                    <div className="mb-4">
                                        <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                                            Platform count
                                        </label>
                                        <input type="text" id="platform" placeholder="Enter platform count" name='total_platform'
                                            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.total_platform}
                                            className="mt-1 w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600 bg-gray-100" />
                                        {/* display error if total_platform is invalid */}

                                        {
                                            formik.errors.total_platform && formik.touched.total_platform ? (
                                                <span className="text-red-500 text-sm flex gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                    </svg>
                                                    <span className='my-auto'>{formik.errors.total_platform}</span>
                                                </span>
                                            ) : null
                                        }
                                    </div>

                                    {/* <!-- City --> */}
                                    <div className="mb-4">
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                            City
                                        </label>
                                        <input type="text" id="city" placeholder="Enter city" name='city'
                                            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.city}
                                            className="mt-1 w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600 bg-gray-100" />
                                        {/* display error if city is invalid */}

                                        {
                                            formik.errors.city && formik.touched.city ? (
                                                <span className="text-red-500 text-sm flex gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                    </svg>
                                                    <span className='my-auto'>{formik.errors.city}</span>
                                                </span>
                                            ) : null
                                        }
                                    </div>

                                    {/* <!-- State --> */}
                                    <div className="mb-4">
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                            State
                                        </label>
                                        <input type="text" id="state" placeholder="Enter state" name='state'
                                            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.state}
                                            className="mt-1 w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600 bg-gray-100" />
                                        {/* display error if state is invalid */}

                                        {
                                            formik.errors.state && formik.touched.state ? (
                                                <span className="text-red-500 text-sm flex gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                    </svg>
                                                    <span className='my-auto'>{formik.errors.state}</span>
                                                </span>
                                            ) : null
                                        }
                                    </div>
                                    {/* <!-- Country --> */}
                                    <div className="mb-4">
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                            Country
                                        </label>
                                        <select type="text" id="country" placeholder="Enter country" name='country'
                                            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.country}
                                            className="mt-1 w-full px-4 py-2 border-b-2 border-gray-300 shadow-sm outline-none focus:border-gray-600 bg-gray-100">
                                            <option value="" defaultValue>--Select country--</option>
                                            {
                                                getNames().map((country, index) => (
                                                    <option key={index} value={country}>{country}</option>
                                                ))
                                            }
                                        </select>
                                        {/* display error if country is invalid */}

                                        {
                                            formik.errors.country && formik.touched.country ? (
                                                <span className="text-red-500 text-sm flex gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                    </svg>
                                                    <span className='my-auto'>{formik.errors.country}</span>
                                                </span>
                                            ) : null
                                        }
                                    </div>

                                    {/* <!-- Submit Button --> */}
                                    <div className="flex justify-center">
                                        <button type="submit" onClick={formik.handleSubmit}
                                            className="w-40 h-10 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 focus:outline-none ">
                                            {
                                                stationLoading ? (
                                                    <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                                                ) : <span >REGISTER</span>
                                            }
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </main>
                    </main>
                )
            }
        </>
    )
}

export default CreateStation