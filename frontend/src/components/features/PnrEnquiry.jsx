import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux';
import { getPNRDetail } from '../../actions/trainAction';
import toast from 'react-hot-toast';
import { clearTrainError } from '../../slices/trainSlice';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import AdminSidebar from '../layout/AdminSidebar';

const PnrEnquiry = ({ setBgImage }) => {

    const dispatch = useDispatch();

    let { loading, error, pnr } = useSelector(state => state.trainState);
    let { loading: authLoading, user } = useSelector(state => state.authState);

    // formik form
    const formik = useFormik({
        initialValues: {
            pnrNumber: '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.pnrNumber) {
                errors.pnrNumber = 'Required';
            }
            return errors;
        },
        onSubmit: values => {
            dispatch(getPNRDetail(values));
        },
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearTrainError());
        }
        setBgImage("bg-white");
    }, [error]);

    return (
        <>
            <MetaData title={"PNR Enquiry"} />
            {
                authLoading ? <Loader /> :

                    <main className='flex'>
                        {
                            user?.role === "admin" && <AdminSidebar />
                        }
                        <div className={user?.role === "admin" ? "container p-2 md:p-5 w-full lg:w-5/6 mx-auto" : "container p-2 md:p-5 w-full"}>

                            <section className=" md:p-6">
                                <div className=" w-full bg-blue-950 p-3 text-center mb-3 text-white px-6">
                                    <h2 className="text-xl font-bold ">PNR Enquiry</h2>
                                </div>
                                <p className="text-gray-600 py-5 px-2 md:px-14 text-center ">Enter the PNR for your booking below to get
                                    the current status. You will find it on the top left corner of the ticket.</p>
                                <form onSubmit={formik.handleSubmit} className="flex justify-center flex-wrap gap-6 my-5 w-full">
                                    <article className=" md:p-2 my-2 ">
                                        <label htmlFor="pnr" className="text-gray-500 text-sm font-semibold">PNR Number</label>
                                        <input type="text" id="pnrNumber"
                                            name='pnrNumber'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.pnrNumber}
                                            className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                                            placeholder="Enter PNR Number" />

                                        {/* display error if pnrNumber is invalid */}
                                        {
                                            formik.errors.pnrNumber && formik.touched.pnrNumber ? (
                                                <span className="text-red-500 text-sm flex gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                                    </svg>
                                                    <span className='my-auto'>{formik.errors.pnrNumber}</span>
                                                </span>
                                            ) : null
                                        }
                                    </article>
                                    <button type="submit" onClick={formik.handleSubmit}
                                        className=" my-auto px-16 py-2 border bg-orange-500 text-lg font-bold text-white rounded w-fit hover:bg-orange-600">
                                        {
                                            loading ? (
                                                <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                                            ) : <span >Submit</span>
                                        }
                                    </button>
                                </form>

                            </section>

                            {/* show pnr details */}
                            {
                                pnr?._id && (
                                    <section className="md:px-5 mb-10">
                                        <div className="flex justify-between flex-wrap mx-2">
                                            <p className="text-md md:text-xl text-gray-600 font-bold pb-3">PNR Number : {pnr?.pnr_number}</p>
                                            <p className="text-md md:text-xl text-gray-600 font-bold  pb-3">Journey Date : {pnr?.date_of_journey}
                                            </p>
                                        </div>
                                        <div className="overflow-x-auto my-2">
                                            <table className="min-w-full bg-white">
                                                <thead>
                                                    <tr className="w-full bg-blue-950 text-white uppercase text-sm leading-normal">
                                                        <th className="py-3 px-2 md:px-6 text-left">Train No</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">Train Name</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">From Station</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">To Station</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">Boarding Station</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">Departure Time</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">Arrival Time</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">className</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-600 text-sm ">
                                                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                                                        <td className="py-3 px-2 md:px-6 text-left">{pnr?.train?.train_number}</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">{pnr?.train?.type}</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">{pnr?.from_station?.name}({pnr?.from_station?.name.slice(0, 3)})</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">{pnr?.to_station?.name}({pnr?.to_station?.name.slice(0, 3)})</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">{pnr?.from_station?.name}({pnr?.from_station?.name.slice(0, 3)})</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">{pnr?.departure_time}</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">{pnr?.arrival_time}</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">{pnr?.class?.name}</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">{pnr?.status}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="overflow-x-auto my-5">
                                            <table className="min-w-full bg-white">
                                                <thead>
                                                    <tr className="w-full bg-blue-950 text-white uppercase text-sm leading-normal">
                                                        <th className="py-3 px-2 md:px-6 text-left">Passenger Name</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">age</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">gender</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">Seat No</th>
                                                        <th className="py-3 px-2 md:px-6 text-left">Booking Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-600 text-sm ">
                                                    {
                                                        pnr?.passengers?.length > 0 && pnr.passengers.map((passenger) => {
                                                            return <tr className="border-b border-gray-200 hover:bg-gray-100">
                                                                <td className="py-3 px-2 md:px-6 text-left">{passenger.name}</td>
                                                                <td className="py-3 px-2 md:px-6 text-left">{passenger.age}</td>
                                                                <td className="py-3 px-2 md:px-6 text-left">{passenger.gender}</td>
                                                                <td className="py-3 px-2 md:px-6 text-left">{passenger.seat_number}</td>
                                                                <td className="py-3 px-2 md:px-6 text-left">{passenger.status}</td>
                                                            </tr>
                                                        })
                                                    }
                                                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                                                        <td className="py-3 px-2 md:px-6 text-left">Johe Deo</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">25</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">Male</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">S24</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">Confirmed</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                                                        <td className="py-3 px-2 md:px-6 text-left">Johe Deo</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">25</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">Male</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">S24</td>
                                                        <td className="py-3 px-2 md:px-6 text-left">Confirmed</td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                )
                            }

                        </div>
                    </main>
            }
        </>
    )
}

export default PnrEnquiry