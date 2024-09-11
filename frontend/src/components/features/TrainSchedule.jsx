import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux';
import { getTrainSchedule } from '../../actions/trainAction';
import toast from 'react-hot-toast';
import { clearTrainError } from '../../slices/trainSlice';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import AdminSidebar from '../layout/AdminSidebar';

const TrainSchedule = ({ setBgImage }) => {

  const dispatch = useDispatch();

  const { loading, error, train } = useSelector(state => state.trainState);
  const { user, loading: authLoading } = useSelector(state => state.authState);

  // formik form
  const formik = useFormik({
    initialValues: {
      trainNumber: ''
    },
    validate: values => {
      const errors = {};
      if (!values.trainNumber) {
        errors.trainNumber = 'Required';
      }
      return errors;
    },
    onSubmit: (values) => {
      dispatch(getTrainSchedule(values.trainNumber));
    }
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
      <MetaData title={"Train Schedule"} />
      {
        authLoading ? <Loader /> :

          <main className='flex'>
            {
              user?.role === "admin" && <AdminSidebar />
            }
            <div className={user?.role === "admin" ? "container p-2 md:p-5 w-full lg:w-5/6 mx-auto" : "container p-2 md:p-5 w-full"}>

              <section className=" md:p-6">
                <div className=" w-full bg-blue-950 p-3 text-center mb-3 text-white px-6">
                  <h2 className="text-xl font-bold ">Train Schedule</h2>
                </div>

                <form onSubmit={formik.handleSubmit} className="flex justify-center flex-wrap gap-6 my-5 w-full">
                  <article className=" md:p-2 my-2 ">
                    <label htmlFor="name" className="text-gray-500 text-sm font-semibold">Train Number</label>
                    <input type="text" id="name"
                      name='trainNumber'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.trainNumber}
                      className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                      placeholder="Enter Train Number" />
                    {/* display error if trainNumber is invalid */}
                    {
                      formik.errors.trainNumber && formik.touched.trainNumber ? (
                        <span className="text-red-500 text-sm flex gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                          </svg>
                          <span className='my-auto'>{formik.errors.trainNumber}</span>
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

                {
                  train?._id && (

                    <div className=" flex items-center justify-center">
                      <div className="bg-white rounded shadow-lg max-w-6xl w-full flex flex-wrap ">
                        {/* <!-- train table --> */}
                        <div className="p-4 overflow-auto w-full">
                          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-md">
                            <thead className="bg-blue-950 font-bold">
                              <tr>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                  Train Number</th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                  Train Name</th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                  From Station</th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                  Destination Station</th>
                                <th
                                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                  Runs On</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{train?.train_number}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-9900">{train?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{train?.source_station?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {train?.destination_station?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {
                                    train?.day_of_operation.length > 0 && train.day_of_operation.map((item, index) => {
                                      return <span key={index} className="bg-green-400 rounded px-1 py-0.5 mx-0.5">{item.toUpperCase()}</span>
                                    })
                                  }
                                  {
                                    train?.return_day_of_operation.length > 0 && train.return_day_of_operation.map((item, index) => {
                                      return <span key={index} className="bg-green-400 rounded px-1 py-0.5 mx-0.5">{item.toUpperCase()}</span>
                                    })
                                  }
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* <!-- train schedule table --> */}
                        <div className="p-4 overflow-auto w-full">
                          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-md">
                            <thead className="bg-blue-950 ">
                              <tr>
                                <th
                                  className="px-2 text-white py-5 text-center text-xs font-medium uppercase tracking-wider">
                                  S.N.</th>
                                <th
                                  className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">
                                  Station Code</th>
                                <th
                                  className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">
                                  Station Name</th>
                                <th
                                  className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">
                                  Route Number</th>
                                <th
                                  className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">
                                  Arrival Time</th>
                                <th
                                  className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">
                                  Departure Time</th>
                                <th
                                  className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">
                                  Halt Time(In minutes)</th>
                                <th
                                  className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">
                                  Distance</th>
                                <th
                                  className="px-2 py-5 text-white text-center text-xs font-medium uppercase tracking-wider">
                                  Day</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {/* <!-- train schedule data --> */}
                              {
                                train?.route.length > 0 && train?.route.map((item, index) => {
                                  return <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.station?.station_code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.station?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.route_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.arrival_time == "00:00" ? "---" : item?.arrival_time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.departure_time == "00:00" ? "---" : item?.departure_time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.halt_time == "00:00" ? "---" : item?.halt_time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.distance == "00:00" ? "---" : `${item?.distance}Km`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.route_number}</td>
                                  </tr>
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )
                }
              </section>


            </div>
          </main>
      }
    </>
  )
}

export default TrainSchedule