import React, { useEffect, useState } from 'react'
import MetaData from './layout/MetaData'
import { useDispatch, useSelector } from 'react-redux';
import { downloadTicket, getTickets } from '../actions/bookingAction';
import AdminSidebar from './layout/AdminSidebar';
import toast from 'react-hot-toast';
import { clearBookingError, clearIsTicketDownloaded } from '../slices/bookingSlice';

const MyBookings = ({ setBgImage }) => {

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.authState);
  const { tickets = [], error, isTicketDownloaded } = useSelector(state => state.bookingState);

  const [ticketList, setTicketList] = useState(tickets);
  const [ticket, setTicket] = useState({});
  const [state, setState] = useState("all");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // function to change state
  const changeCurrentState = (path) => {
    setState(path);
  };

  // function to open toggleDropdown
  const toggleDropdown = (event, id) => {
    const dropdownMenus = document.querySelector(`#${id}`);
    dropdownMenus.classList.toggle('hidden');
    event.stopPropagation();
  };

  // function to open ticket modal
  const handleViewTicket = (ticketId) => {
    const filteredTicket = tickets.find((ticket) => ticket._id === ticketId);

    setTicket(filteredTicket);
    setIsTicketModalOpen(true);
  };

  // function to download ticket
  const ticketDownload = (id) => {
    dispatch(downloadTicket(id));
  }

  useEffect(() => {
    if (tickets.length > 0) {
      if (state === "all") {
        setTicketList(tickets);
      }
      if (state === "upcomming") {
        const filteredTicketList = tickets.filter(ticket => {
          const currentDate = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`;

          return ticket.date_of_journey > currentDate;
        });
        setTicketList(filteredTicketList);
      }
      if (state === "past") {
        const filteredTicketList = tickets.filter(ticket => {
          const currentDate = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`;

          return ticket.date_of_journey < currentDate;
        });
        setTicketList(filteredTicketList);
      }
    }

  }, [state, tickets]);

  useEffect(() => {
    if (isTicketDownloaded) {
      toast.success("Ticket Downloaded Successfully");
      setIsTicketModalOpen(false);
      dispatch(clearIsTicketDownloaded());
    }
    if (error) {
      toast.error(error);
      dispatch(clearBookingError());
    }
  }, [error, isTicketDownloaded]);

  useEffect(() => {
    setBgImage("bg-white");
    dispatch(getTickets)

    // close dropdownlist
    document.addEventListener('click', () => {
      const dropdownMenus = document.querySelectorAll('.dropdown');
      dropdownMenus.forEach(menu => {
        menu.classList.add('hidden');
      });
    });

  }, [dispatch, setBgImage]);

  return (
    <>
      <MetaData title={"My Bookings"} />

      <main className='flex'>
        {
          user?.role === "admin" && <AdminSidebar />
        }

        <div className={user?.role === "admin" ? 'w-full lg:w-5/6 mx-auto h-screen overflow-y-auto' : 'w-full'}>
          <h2 className="text-3xl font-bold p-3 text-center mx-auto">My Bookings</h2>

          <div className="container md:p-5 mx-auto">
            <ul className="flex">
              <li onClick={() => changeCurrentState("all")}
                className={state === "all" ? "p-2 md:p-4 text-gray-700 font-semibold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2  cursor-pointer bg-gray-200 border border-gray-600" : "text-white font-semibold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2 bg-blue-950 cursor-pointer border border-gray-200"}>
                <span className="my-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20" height="15"
                    fill="currentcolor">
                    <path
                      d="M64 64C28.7 64 0 92.7 0 128l0 64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320l0 64c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-64c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6l0-64c0-35.3-28.7-64-64-64L64 64zm64 112l0 160c0 8.8 7.2 16 16 16l288 0c8.8 0 16-7.2 16-16l0-160c0-8.8-7.2-16-16-16l-288 0c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-320 0c-17.7 0-32-14.3-32-32l0-192z" />
                  </svg>
                </span>
                <span className="my-auto">All Journey</span>
              </li>
              <li onClick={() => changeCurrentState("upcomming")}
                className={state === "upcomming" ? "p-2 md:p-4 text-gray-700 font-semibold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2  cursor-pointer bg-gray-200 border border-gray-600" : "text-white font-semibold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2 bg-blue-950 cursor-pointer border border-gray-200"}>
                <span className="my-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentcolor" width="20"
                    height="15">
                    <path
                      d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                  </svg>
                </span>
                <span className="my-auto">Upcomming Journey</span>
              </li>
              <li onClick={() => changeCurrentState("past")}
                className={state === "past" ? "p-2 md:p-4 text-gray-700 font-semibold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2  cursor-pointer bg-gray-200 border border-gray-600" : "text-white font-semibold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2 bg-blue-950 cursor-pointer border border-gray-200"}>
                <span className="my-auto ">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20" height="15"
                    fill="currentcolor">
                    <path
                      d="M0 80L0 229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7L48 32C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                  </svg>
                </span>
                <span className="my-auto">Past Journey </span>
              </li>

            </ul>
          </div>

          <h2 className='text-gray-500 font-bold text-xl p-1 pl-20'>{ticketList?.length} results found in your {state.toLowerCase()} Journey.</h2>

          <div className="w-full p-1 md:p-6 flex flex-wrap justify-center">

            {
              ticketList?.length > 0 ?
                ticketList.map((ticket, index) => {
                  // Parsing the date_of_journey
                  const date = new Date(ticket?.date_of_journey);
                  const weekDay = date.toLocaleString('en-US', { weekday: 'short' });
                  const day = date.getDate().toString().padStart(2, '0');
                  const monthYear = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });

                  const bookingDate = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

                  // Correctly formatted current date for comparison
                  const currentDate = new Date().toISOString().split('T')[0];

                  // Booking date formatted for comparison
                  const bookingDateFormatted = ticket.date_of_journey.split('T')[0];

                  const bookedDate = new Date(ticket?.booking_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

                  return (
                    <div key={index} className="m-1 md:m-3 border border-gray-400 flex justify-center items-center bg-white shadow-md rounded-lg">
                      <div onClick={() => handleViewTicket(ticket._id)}
                        className="w-1/3 h-full md:p-2 md:px-6 bg-gray-200 pt-3 md:pt-6 text-center hover:cursor-pointer">
                        <p className="text-sm text-gray-500 font-bold">{weekDay}</p>
                        <h1 className="text-2xl md:text-4xl text-gray-800 font-bold">{day}</h1>
                        <p className="text-sm text-gray-500 font-semibold">{monthYear}</p>
                        <div className="inset-0 flex justify-center my-3">
                          <span className={bookingDateFormatted > currentDate ? "text-sm border-2 border-green-400 px-3 border-dotted text-green-400 font-semibold transform -rotate-12" : "text-sm border-2 border-red-400 px-3 border-dotted text-red-400 font-semibold transform -rotate-12"}>
                            {bookingDateFormatted > currentDate ? `${ticket.booking_status}` : "Expired"}
                          </span>
                        </div>
                      </div>

                      <div className="w-2/3 text-sm md:text-md p-3 flex flex-col gap-2">
                        <div className="flex justify-between relative">
                          <p className="text-gray-500 font-semibold my-auto">PNR No: <span className="font-bold">{ticket?.pnr?.pnr_number}</span></p>

                          <button id="dropdownButton" onClick={(e) => toggleDropdown(e, `dropdownMenu${index}`)}
                            className="rounded-full hover:bg-gray-200 focus:outline-none">
                            <svg className="w-6 h-6 text-gray-900 font-bold my-auto" fill="none" stroke="currentColor"
                              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M12 6v.01M12 12v.01M12 18v.01"></path>
                            </svg>
                          </button>

                          <div id={`dropdownMenu${index}`}
                            className="dropdown absolute right-0 top-5 mt-2 w-48 bg-white border border-gray-500 rounded-lg shadow-lg hidden">
                            <p onClick={() => handleViewTicket(ticket?._id)}
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-600 hover:text-white">View Ticket</p>
                            <p onClick={() => ticketDownload(ticket?._id)} className="block px-4 py-2 text-gray-700 hover:bg-gray-600 hover:text-white">Print Ticket</p>
                          </div>
                        </div>

                        <p className="text-gray-500 font-semibold">{ticket?.train?.name} ({ticket?.train?.train_number})</p>
                        <div className="flex gap-1 md:gap-3 text-gray-500 font-semibold flex-wrap">
                          <div className="flex text-gray-500 gap-1 md:gap-3">
                            <span>{ticket?.from_station?.station_code}</span>
                            <span className="my-auto">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 md:size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                              </svg>
                            </span>
                            <span>{ticket?.to_station?.station_code}</span>
                          </div>
                          <div className="flex text-gray-500 gap-1 md:gap-3">
                            <span>{ticket?.departure_time}</span>
                            <span>{ticket?.arrival_time}</span>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-gray-500">
                          <span className="text-sm text-gray-600 font-semibold md:me-3">Booking Date: </span>{bookedDate}
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className='text-center p-5 mt-10'>
                    <h5>Tickets not found</h5>
                  </div>
                )
            }

          </div>

          {/* <!-- ticket details model --> */}
          {
            isTicketModalOpen && (

              <div id="ticketModal" className="fixed flex inset-0 items-center justify-center bg-blue-950 bg-opacity-50">
                <div className="bg-white rounded shadow-lg max-w-3xl max-h-96 overflow-y-auto w-full flex flex-wrap ">
                  <div className="flex justify-between w-full bg-gray-800 p-3 text-white px-6">
                    <h2 className="text-xl font-bold ">Ticket Details</h2>
                    <span id="close_train_schedule_popup" onClick={() => {
                      setIsTicketModalOpen(false);
                      setTicket(null);
                    }} className="hover:cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentcolor" height="25"
                        width="25">
                        <path
                          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                      </svg>
                    </span>
                  </div>

                  <div className="p-6 text-gray-600">
                    <div className="flex md:gap-10 mx-8">
                      <div className='w-1/2'>
                        <h3 className="text-lg font-bold mb-4 bg-blue-950 px-5 py-2 text-white">Train Information</h3>
                        <p><strong>Train Name:</strong> {ticket?.train?.name}</p>
                        <p><strong>Train Number:</strong> {ticket?.train?.train_number}</p>
                        <p><strong>Source Station:</strong> {ticket?.from_station?.name} ({ticket?.from_station?.station_code})</p>
                        <p><strong>Destination Station:</strong> {ticket?.to_station?.name} ({ticket?.to_station?.station_code})</p>
                        <p><strong>Date of Journey:</strong> {ticket?.date_of_journey}</p>
                        <p><strong>Departure Time:</strong> {ticket?.departure_time}</p>
                        <p><strong>Arrival Time:</strong> {ticket?.arrival_time}</p>
                      </div>

                      <div className='w-1/2'>
                        <h3 className="text-lg font-bold mt-6 mb-4 bg-blue-950 px-5 py-2 text-white">Ticket Information
                        </h3>
                        <p><strong>Booking Date:</strong> {ticket?.booking_date.toString().slice(0, 10)}</p>
                        <p><strong>className:</strong> {ticket?.class?.name}</p>
                        <p><strong>Fare:</strong> &#8377; {ticket?.total_fare.toFixed(2)}</p>
                        <p><strong>Payment Status:</strong> {ticket?.payment_status}</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mt-6 mb-4 mx-8 bg-blue-950 px-5 py-2 text-white">Passenger Information
                    </h3>
                    <div className="flex md:gap-20 flex-wrap mx-8">
                      {
                        ticket?.passengers.length > 0 &&
                        ticket.passengers.map((pass) => <div>
                          <p><strong>Name:</strong> {pass?.name}</p>
                          <p><strong>Age:</strong> {pass?.age}</p>
                          <p><strong>Gender:</strong> {pass?.gender}</p>
                          <p><strong>Berth:</strong> {pass?.berth}</p>
                          <p><strong>Seat Number:</strong> {pass?.seat_number}</p>
                          <p><strong>Booking Status:</strong> {pass?.status}</p>
                        </div>
                        )
                      }
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button onClick={() => {
                        setIsTicketModalOpen(false);
                        setTicket(null);
                      }}
                        className="border border-gray-600 font-semibold py-2 px-4 rounded mr-2 hover:bg-gray-300">
                        Close
                      </button>
                      <button onClick={() => ticketDownload(ticket?._id)} type='button' className="bg-orange-600 text-white font-semibold py-2 px-4 rounded hover:bg-orange-700">
                        Print Ticket
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )
          }
        </div>
      </main>
    </>
  )
}

export default MyBookings