import React, { useEffect, useState } from 'react';
import MetaData from '../layout/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStations } from '../../actions/stationAction';
import { getAllTrains, getTrainFare } from '../../actions/trainAction';
import { toast } from 'react-hot-toast';
import { clearTrainError } from '../../slices/trainSlice';
import Loader from '../layout/Loader';
import AdminSidebar from '../layout/AdminSidebar';

const FareEnquiry = ({ setBgImage }) => {
  const dispatch = useDispatch();

  // state
  const { stations } = useSelector(state => state.stationState);
  const { trains, fare, error, loading } = useSelector(state => state.trainState);
  const { user, loading: authLoading } = useSelector(state => state.authState);

  const [trainList, setTrainList] = useState([]);
  const [sourceStationList, setSourceStationList] = useState([]);
  const [destinationStationList, setDestinationStationList] = useState([]);
  const [train, setTrain] = useState('');
  const [sourceStation, setSourceStation] = useState('');
  const [destinationStation, setDestinationStation] = useState('');
  const [journeyDate, setJourneyDate] = useState('');
  const [formData, setFormData] = useState({});

  // function to change sourceStation list
  const changeSourceStationList = (e) => {
    setSourceStation(e.target.value);
    const sourceStationList = stations.filter(station =>
      station.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSourceStationList(sourceStationList);
  };

  // function to change destinationStation list
  const changeDestinationStationList = (e) => {
    setDestinationStation(e.target.value);
    const destinationStationList = stations.filter(station =>
      station.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDestinationStationList(destinationStationList);
  };

  // function to change train list
  const changeTrainList = (e) => {
    setTrain(e.target.value);
    const trainsList = trains.filter(train =>
      train.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setTrainList(trainsList);
  };

  // function to set source station id
  const setSourceStationIdFunc = (id) => {
    setFormData(prev => ({ ...prev, source: id }));
    setSourceStationList([]);
  };

  // function to set destination station id
  const setDestinationStationIdFunc = (id) => {
    setFormData(prev => ({ ...prev, destination: id }));
    setDestinationStationList([]);
  };

  // function to set train id
  const setTrainIdFunc = (id) => {
    setFormData(prev => ({ ...prev, trainId: id }));
    setTrainList([]);
  };

  // function to handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.trainId || !formData.source || !formData.destination || !journeyDate) {
      toast.error("Please fill all the fields");
      return;
    }
    dispatch(getTrainFare(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearTrainError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    setBgImage("bg-white");
    dispatch(getAllStations);
    dispatch(getAllTrains);
  }, [dispatch, setBgImage]);

  return (
    <>
      <MetaData title={"Fare Enquiry"} />
      {
        authLoading ? <Loader /> :

          <main className='flex'>
            {
              user?.role === "admin" && <AdminSidebar />
            }
            <div className={user.role === "admin" ? "container p-2 md:p-5 w-full lg:5/6 mx-auto" : "container p-2 md:p-5 w-full"}>
              <section className="md:p-6">
                <div className="w-full bg-blue-950 p-3 text-center mb-3 text-white px-6">
                  <h2 className="text-xl font-bold">Fare Enquiry</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex">
                  <div className="w-1/2 text-end flex flex-col gap-3">
                    <label htmlFor="train_number" className="text-gray-500 text-sm font-semibold mt-3 pe-3">Train Name:</label>
                    <label htmlFor="journey_date" className="text-gray-500 text-sm font-semibold mt-5 pe-3">Journey Date:</label>
                    <label htmlFor="source_station" className="text-gray-500 text-sm font-semibold mt-5 pe-3">Source Station:</label>
                    <label htmlFor="destination_station" className="text-gray-500 text-sm font-semibold mt-5 pe-3">Destination Station:</label>
                  </div>
                  <div className="w-1/2 text-start p-1 md:ps-3 pe-2 flex flex-col gap-3">
                    <article>
                      <input
                        type="search"
                        id="train_number"
                        name='trainid'
                        onChange={changeTrainList}
                        value={train}
                        className="md:w-1/2 border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                        placeholder="Search train"
                      />
                      {trainList.length > 0 && (
                        <ul className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                          {trainList.map((train, index) => (
                            <li
                              key={index}
                              className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white"
                              onClick={() => {
                                setTrainIdFunc(train._id);
                                setTrain(train.name);
                              }}
                            >
                              {train.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                    <input
                      type="date"
                      id="journey_date"
                      name='date'
                      value={journeyDate}
                      onChange={(e) => {
                        setJourneyDate(e.target.value);
                        setFormData(prev => ({ ...prev, journeyDate: e.target.value }));
                      }}
                      className="md:w-1/2 border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                    />
                    <article>
                      <input
                        type="search"
                        id="source_station"
                        name='source'
                        onChange={changeSourceStationList}
                        value={sourceStation}
                        className="md:w-1/2 border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                        placeholder="Enter Source Station"
                      />
                      {sourceStationList.length > 0 && (
                        <ul className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                          {sourceStationList.map((station, index) => (
                            <li
                              key={index}
                              className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white"
                              onClick={() => {
                                setSourceStationIdFunc(station._id);
                                setSourceStation(station.name);
                              }}
                            >
                              {station.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                    <article className='md:w-1/2'>
                      <input
                        type="search"
                        id="destination_station"
                        name='destination'
                        onChange={changeDestinationStationList}
                        value={destinationStation}
                        className=" border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                        placeholder="Enter Destination Station"
                      />
                      {destinationStationList.length > 0 && (
                        <ul className="absolute z-10 w-auto md:min-w-60 mt-1 bg-white border border-gray-300 text-sm rounded-md shadow-lg max-h-60 overflow-auto">
                          {destinationStationList.map((station, index) => (
                            <li
                              key={index}
                              className="cursor-pointer px-4 py-2 hover:bg-blue-800 hover:text-white"
                              onClick={() => {
                                setDestinationStationIdFunc(station._id);
                                setDestinationStation(station.name);
                              }}
                            >
                              {station.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  </div>
                </form>
                <div className="text-center p-3">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="my-auto px-16 py-2 border bg-orange-500 text-lg font-bold text-white rounded w-fit hover:bg-orange-600"
                  >
                    {
                      loading ? (
                        <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                      ) : <span >Submit</span>
                    }
                  </button>
                </div>
              </section>

              {
                fare?.train_number && (
                  <section className="p-1 pb-8 md:px-5">

                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-blue-950 text-white uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Train name</th>
                            <th className="py-3 px-6 text-left">Train number</th>
                            <th className="py-3 px-6 text-left">Source station</th>
                            <th className="py-3 px-6 text-left">Destination station</th>
                            <th className="py-3 px-6 text-left">Journey Date</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                          <tr className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left">{fare?.train_name}</td>
                            <td className="py-3 px-6 text-left">{fare?.train_number}</td>
                            <td className="py-3 px-6 text-left">{fare?.sourceStation}</td>
                            <td className="py-3 px-6 text-left">{fare?.destinationStation}</td>
                            <td className="py-3 px-6 text-left">{fare?.classFares.length && fare?.classFares[0].journey_date}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-blue-950 text-white uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Class</th>
                            <th className="py-3 px-6 text-left">Base Fare</th>
                            <th className="py-3 px-6 text-left">Tax</th>
                            <th className="py-3 px-6 text-left">Total fare</th>
                            <th className="py-3 px-6 text-left">Availability</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                          {
                            fare?.classFares.length > 0 && fare?.classFares.map((cls, index) => (
                              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">{cls.class}</td>
                                <td className="py-3 px-6 text-left">&#8377;{cls.base_fare.toFixed(2)}</td>
                                <td className="py-3 px-6 text-left">&#8377;{cls.tax.toFixed(2)}</td>
                                <td className="py-3 px-6 text-left">&#8377;{cls.total_fare.toFixed(2)}</td>
                                <td className="py-3 px-6 text-left">{cls.status}</td>
                              </tr>
                            ))
                          }
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
  );
};

export default FareEnquiry;
