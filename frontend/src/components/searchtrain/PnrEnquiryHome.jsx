import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { clearTrainError } from '../../slices/trainSlice';
import { useFormik } from "formik"
import { getPNRDetail } from '../../actions/trainAction';
import { useNavigate } from 'react-router-dom';

const PnrEnquiryHome = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading = false, error = null, pnr = {} } = useSelector(state => state.trainState);
    const { isAuthenticatedUser } = useSelector(state => state.authState);

    const [pnrNumber, setPnrNumber] = useState(JSON.parse(sessionStorage.getItem('pnr')) || null);

    useEffect(() => {
        if (error) {
            if (!isAuthenticatedUser) {
                sessionStorage.setItem('pnr', JSON.stringify(formik.values.pnrNumber));
                dispatch(clearTrainError());
                return navigate("/login")
            }
            toast.error(error);
            dispatch(clearTrainError());
        }
        if (pnr?.pnr_number) {
            formik.resetForm();
        }
    }, [dispatch, error, pnr]);

    useEffect(() => {
        if (pnrNumber) {
            formik.setFieldValue('pnrNumber', pnrNumber);
            dispatch(getPNRDetail({ pnrNumber }));
            sessionStorage.removeItem('pnr')
        }
    }, [pnrNumber]);

    // formik form
    const formik = useFormik({
        initialValues: {
            pnrNumber: "",
        },
        validate: (values) => {
            const errors = {};
            if (!values.pnrNumber) {
                errors.pnrNumber = "Required";
            }
            return errors;
        },
        // submit form
        onSubmit: (values) => {
            dispatch(getPNRDetail(values));

        },
    })

    return (
        <div className='bg-white border'>
            <p className="text-gray-600 py-5 px-2 md:px-14 text-center">Enter the PNR for your booking below to get
                the current status. You will find it on the top left corner of the ticket.</p>
            <form onSubmit={formik.handleSubmit} className="p-2 md:p-2 lg:p-4">
                <section className="flex flex-col gap-3 md:gap-0 md:flex-row relative lg:p-2">
                    <article className="flex flex-col md:p-5 w-full md:w-1/3 mx-auto ">
                        <label htmlFor="pnr" className="text-gray-500 text-sm font-semibold">PNR Number</label>
                        <input type="search" id="pnr"
                            name='pnrNumber'
                            value={formik.values.pnrNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold  md:font-bold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                            placeholder="Enter PNR Number" />

                        {/* display error if pnrnumber is invalid */}
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

                        <div className="text-center p-2 mt-4">
                            <button type='submit' onClick={formik.handleSubmit}
                                className="bg-gray-900 text-white px-8 py-2 md:py-3 rounded text-md font-semibold">Submit</button>
                        </div>
                    </article>
                </section>

                {/* show pnr details */}
                {
                    pnr && pnr?.pnr_number ? (
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
                    ) : null
                }
            </form>
        </div>
    )
}

export default PnrEnquiryHome