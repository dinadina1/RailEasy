import React, { useEffect } from 'react'
import AdminSidebar from '../layout/AdminSidebar';
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik'
import toast from 'react-hot-toast';
import { clearBookingError, clearIsReportDownloaded } from '../../slices/bookingSlice';
import { downloadTransactionReport } from '../../actions/bookingAction';

const DailyTransactionReport = ({ setBgImage }) => {

    const dispatch = useDispatch();

    const { loading, user } = useSelector(state => state.authState);
    const { error, loading: reportLoading, isDownloaded } = useSelector(state => state.bookingState);

    // formik form
    const formik = useFormik({
        initialValues: {
            date: ''
        },
        validate: values => {
            const errors = {};
            if (!values.date) {
                errors.date = 'Required';
            }
            return errors;
        },
        // submit form
        onSubmit: (values) => {
            dispatch(downloadTransactionReport(values.date));
        }
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearBookingError());
        }
        if (isDownloaded) {
            toast.success('Report Downloaded');
            dispatch(clearIsReportDownloaded());
        }
    }, [error, isDownloaded]);

    useEffect(() => {
        setBgImage("bg-white");
    }, []);

    return (
        <>
            <MetaData title={"Daily Transaction Report"} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        {/* <!-- main content --> */}
                        <div className="w-full md:w-5/6 mx-auto bg-white p-2 md:p-8 rounded-lg shadow-md">

                            <div className="p-5 flex items-center justify-center">
                                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Daily Transaction Report</h2>

                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="mb-4">
                                            <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Select
                                                Date:</label>
                                            <input type="date" id="date" name="date"
                                                onChange={formik.handleChange} value={formik.values.date} onBlur={formik.handleBlur}
                                                className="p-3 border-b-2 shadow-sm outline-none focus:ring-indigo-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                required />
                                            {/* display error if date is invalid */}
                                            {
                                                formik.errors.date && formik.touched.date ? (
                                                    <span className="text-red-500 text-sm flex gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                        </svg>
                                                        <span className='my-auto'>{formik.errors.date}</span>
                                                    </span>
                                                ) : null
                                            }
                                        </div>

                                        <div className="flex justify-center">
                                            <button type="submit" onClick={formik.handleSubmit}
                                                className="bg-indigo-600 text-white font-semibold w-44 h-10 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                {
                                                    reportLoading ? (
                                                        <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                                                    ) : <span >Download Report</span>
                                                }
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </main>
                )
            }
        </>
    )
}

export default DailyTransactionReport