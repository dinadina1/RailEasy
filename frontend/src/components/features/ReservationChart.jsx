import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearTrainError } from '../../slices/trainSlice';
import toast from 'react-hot-toast';
import { getAllTrains, getReservationChart } from '../../actions/trainAction';
import { useFormik } from 'formik';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import AdminSidebar from '../layout/AdminSidebar';

const ReservationChart = ({ setBgImage }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading = false, error = null, reservationChart = {}, trains = [] } = useSelector(state => state.trainState);
  const { user, loading: authLoading } = useSelector(state => state.authState);

  const [trainList, setTrainList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [trainId, setTrainId] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearTrainError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(getAllTrains);
    setBgImage("bg-white");
  }, [dispatch]);

  // formik form
  const formik = useFormik({
    initialValues: {
      trainid: "",
      date: "",
      boardingstation: ""
    },
    validate: (values) => {
      const errors = {};
      if (!values.trainid) {
        errors.trainid = "Required";
      }
      if (!values.date) {
        errors.date = "Required";
      }
      if (!values.boardingstation) {
        errors.boardingstation = "Required";
      }
      return errors;
    },
    // submit form
    onSubmit: (values) => {

      dispatch(getReservationChart({
        trainid: trainId,
        date: values.date,
        boardingstation: values.boardingstation
      }));
    },
  })

  // function to change train list
  const handleChangeTrain = (e) => {
    const { value } = e.target;
    setStationList([])
    formik.setFieldValue('trainid', value);

    const filteredTrains = trains.filter(train => train.name.toLowerCase().includes(value.toLowerCase()));
    setTrainList(filteredTrains);
    const filteredStations = [];
    if (filteredTrains.length > 0) {
      filteredTrains.forEach(train => {
        if (train?.route.length > 0) {
          train.route.forEach(station => {
            filteredStations.push({
              station: station.station.name,
              id: station.station._id
            });
          });
        }
      });
    }
    setStationList(filteredStations);
  }


  return (
    <>
      <MetaData title={"Reservation Chart"} />
      {
        authLoading ? <Loader /> :

          <main className='flex'>
            {
              user?.role === "admin" && <AdminSidebar />
            }
      <div className={user.role === "admin" ? "container p-2 md:p-5 w-full lg:5/6 mx-auto" : "container p-2 md:p-5 w-full"}>

        <div className=" w-full p-3 text-center mb-3 text-white px-7">
          <h2 className="text-xl p-3 font-bold bg-blue-950">Passenger Reservation Chart</h2>
        </div>
        <form onSubmit={formik.handleSubmit} className="p-2 md:p-2 lg:p-4">
          <section className="flex flex-col gap-3 md:gap-2 relative lg:p-2">
            <div className="w-full md:w-1/3 mx-auto ">
              <article className="flex flex-col md:p-2 ">
                <label htmlFor="train_number" className="text-gray-500 text-sm font-semibold">Search
                  Train</label>
                <input type="search" id="train_number"
                  name="trainid"
                  value={formik.values.trainid}
                  onChange={handleChangeTrain}
                  onBlur={formik.handleBlur}
                  className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                  placeholder="Enter train name" />
              </article>

              {
                trainList.length > 0 && (
                  <ul
                    className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                    {
                      trainList.map((train, index) =>
                        <li key={index} onClick={() => {
                          formik.setFieldValue('trainid', train.name);
                          setTrainId(train._id);
                          setTrainList([]);
                        }} className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white">{train.name}</li>
                      )
                    }
                  </ul>
                )
              }
              {/* display error if trainid is invalid */}
              {
                formik.errors.trainid && formik.touched.trainid ? (
                  <span className="text-red-500 text-sm flex gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className='my-auto'>{formik.errors.trainid}</span>
                  </span>
                ) : null
              }
            </div>
            <article className="flex flex-col md:p-2 w-full md:w-1/3 mx-auto ">
              <label htmlFor="journey_date" className="text-gray-500 text-sm font-semibold">Journey
                Date</label>
              <input type="date" id="journey_date"
                name='date'
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                placeholder="Enter date" />
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
            </article>
            <article className="flex flex-col md:p-2 w-full md:w-1/3 mx-auto ">
              <label htmlFor="boarding_station" className="text-gray-500 text-sm font-semibold">Boarding
                Station</label>
              <select name="boardingstation" id="boarding_station"
                value={formik.values.boardingstation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600">
                <option value="">--Select--</option>
                {
                  stationList.length > 0 && stationList.map((station, index) => (
                    <option key={index} value={station.id}>{station.station}</option>
                  ))
                }
              </select>
              {/* display error if boardingstation is invalid */}
              {
                formik.errors.boardingstation && formik.touched.boardingstation ? (
                  <span className="text-red-500 text-sm flex gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className='my-auto'>{formik.errors.boardingstation}</span>
                  </span>
                ) : null
              }
            </article>
            <div className="text-center p-2 mt-4">
              <button type='submit' onClick={formik.handleSubmit}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 md:py-3 rounded text-md font-semibold">Get
                {
                  loading ? (
                    <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                  ) : <span >Train Chart</span>
                }
              </button>
            </div>

          </section>
        </form>

        {
          reservationChart?.train && (
            <section className="md:px-5 mb-10">
              <div className="flex justify-between flex-wrap mx-2">
                <p className="text-md md:text-xl text-gray-600 font-bold pb-3">Train Number : {reservationChart?.train?.train_number}</p>
                <p className="text-md md:text-xl text-gray-600 font-bold  pb-3">Journey Date : {reservationChart?.bookings?.length && reservationChart?.bookings[0]?.date_of_journey}</p>
              </div>
              <div className="overflow-x-auto my-2">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="w-full bg-blue-950 text-white uppercase text-sm leading-normal">
                      <th className="py-3 px-2 md:px-6 text-left">Train No</th>
                      <th className="py-3 px-2 md:px-6 text-left">Train Name</th>
                      <th className="py-3 px-2 md:px-6 text-left">Source Station</th>
                      <th className="py-3 px-2 md:px-6 text-left">Destination Station</th>
                      <th className="py-3 px-2 md:px-6 text-left">Boarding Station</th>
                      <th className="py-3 px-2 md:px-6 text-left">Departure Time</th>
                      <th className="py-3 px-2 md:px-6 text-left">Arrival Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm ">
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-2 md:px-6 text-left">{reservationChart?.train?.train_number}</td>
                      <td className="py-3 px-2 md:px-6 text-left">{reservationChart?.train?.name}</td>
                      <td className="py-3 px-2 md:px-6 text-left">{reservationChart?.train?.source_station?.name}({reservationChart?.train?.source_station?.name.slice(0, 3)})</td>
                      <td className="py-3 px-2 md:px-6 text-left">{reservationChart?.train?.destination_station?.name}({reservationChart?.train?.destination_station?.name.slice(0, 3)})</td>
                      <td className="py-3 px-2 md:px-6 text-left">{reservationChart?.station?.name}({reservationChart?.station?.name.slice(0, 3)})</td>
                      <td className="py-3 px-2 md:px-6 text-left">{reservationChart?.bookings?.length && reservationChart.bookings[0].departure_time}</td>
                      <td className="py-3 px-2 md:px-6 text-left">{reservationChart?.bookings?.length && reservationChart.bookings[0].arrival_time}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto my-5">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="w-full bg-blue-950 text-white uppercase text-sm leading-normal">
                      <th className="py-3 px-2 md:px-6 text-left">Booking ID</th>
                      <th className="py-3 px-2 md:px-6 text-left">Name</th>
                      <th className="py-3 px-2 md:px-6 text-left">age</th>
                      <th className="py-3 px-2 md:px-6 text-left">gender</th>
                      <th className="py-3 px-2 md:px-6 text-left">Seat No</th>
                      <th className="py-3 px-2 md:px-6 text-left">pnr</th>
                      <th className="py-3 px-2 md:px-6 text-left">Booking Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm ">
                    {
                      reservationChart?.bookings?.length > 0 && reservationChart?.bookings?.map((booking, index) => (
                        <Fragment key={index}>
                          {
                            booking?.passengers?.length > 0 && booking?.passengers?.map((passenger, index) => {
                              return (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                  <td className="py-3 px-2 md:px-6 text-left">{booking?.booking_id}</td>
                                  <td className="py-3 px-2 md:px-6 text-left">{passenger?.name}</td>
                                  <td className="py-3 px-2 md:px-6 text-left">{passenger?.age}</td>
                                  <td className="py-3 px-2 md:px-6 text-left">{passenger?.gender}</td>
                                  <td className="py-3 px-2 md:px-6 text-left">{passenger?.seat_number}</td>
                                  <td className="py-3 px-2 md:px-6 text-left">{booking?.pnr?.pnr_number}</td>
                                  <td className="py-3 px-2 md:px-6 text-left">{passenger?.status}</td>
                                </tr>
                              )
                            })
                          }
                        </Fragment>
                        // </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </section>
          )
        }

      </div >
      </main>
}
    </>
  )
}

export default ReservationChart