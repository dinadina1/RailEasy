import React, { useEffect, useState } from 'react'
import Navbar from './layout/Navbar'
import SearchTrainHome from './searchtrain/SearchTrainHome'
import PnrEnquiryHome from './searchtrain/PnrEnquiryHome'
import ReservationChartHome from './searchtrain/ReservationChartHome'
import MetaData from './layout/MetaData'
import { useSelector } from 'react-redux'
import AdminSidebar from './layout/AdminSidebar'
import Loader from './layout/Loader'

const Home = ({ setBgImage }) => {

  const [homeNav, setHomeNav] = useState("train");
  const { loading = true, user } = useSelector(state => state.authState);

  // change home nav
  const getHomeNav = (menu) => {
    setHomeNav(menu);
    sessionStorage.setItem("homeNav", JSON.stringify(menu));
  }

  useEffect(() => {
    const homeNav = JSON.parse(sessionStorage.getItem("homeNav"));
    if (homeNav) {
      setHomeNav(homeNav);
    }
    setBgImage("bg-[url('/src/assets/train_background.jpg')]")
  }, [])

  return (
    <>
      <MetaData title={"Home"} />
      {
        loading ? <Loader /> :

          <main className='flex'>
            {
              user?.role === "admin" && <AdminSidebar />
            }
            <div className={user?.role === "admin" ? "container p-2 md:p-5 w-full lg:5/6 mx-auto" : "container p-2 md:p-5 w-full"}>
              <article className="mt-2 md:mt-4">
                <h2 className="text-xl md:text-3xl p-2 text-center font-semibold text-white">INDIAN RAILWAYS</h2>
                <div className="flex gap-4 justify-center my-3">
                  <p className="pe-4 border-r-2 border-red-500 text-white font-semibold md:text-xl">Safety</p>
                  <p className="pe-4 border-r-2 border-red-500 text-white font-semibold md:text-xl">Security</p>
                  <p className=" pe-4 border-red-400 text-white font-semibold md:text-xl">Punctuality</p>
                </div>
              </article>

              <ul className="flex bg-gray-200">
                <li onClick={() => getHomeNav("train")}
                  className={homeNav === "train" ? "text-blue-600 p-2 md:p-4 bg-white font-bold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2 cursor-pointer hover:bg-gray-300 " :
                    "text-gray-600 p-2 md:p-4 font-semibold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2 cursor-pointer hover:bg-gray-300"
                  }>
                  <span className="my-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20" height="15">
                      <path
                        d="M64 64C28.7 64 0 92.7 0 128l0 64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320l0 64c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-64c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6l0-64c0-35.3-28.7-64-64-64L64 64zm64 112l0 160c0 8.8 7.2 16 16 16l288 0c8.8 0 16-7.2 16-16l0-160c0-8.8-7.2-16-16-16l-288 0c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-320 0c-17.7 0-32-14.3-32-32l0-192z" />
                    </svg>
                  </span>
                  <span className="my-auto">Book Ticket</span>
                </li>
                <li onClick={() => getHomeNav("pnr")}
                  className={homeNav === "pnr" ? "text-blue-600 p-2 md:p-4 bg-white font-bold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2 cursor-pointer hover:bg-gray-300 " :
                    "text-gray-600 p-2 md:p-4 font-semibold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2 cursor-pointer hover:bg-gray-300"
                  }>
                  <span className="my-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20" height="15">
                      <path
                        d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM305 273L177 401c-9.4 9.4-24.6 9.4-33.9 0L79 337c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L271 239c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                    </svg>
                  </span>
                  <span className="my-auto">PNR Enquiry</span>
                </li>
                <li onClick={() => getHomeNav("chart")}
                  className={homeNav === "chart" ? "text-blue-600 p-2 md:p-4 bg-white font-bold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2 cursor-pointer hover:bg-gray-300 " :
                    "text-gray-600 p-2 md:p-4 font-semibold text-sm md:text-md w-1/3 flex flex-col md:flex-row justify-center items-center md:gap-2 cursor-pointer hover:bg-gray-300"
                  }>
                  <span className="my-auto ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20" height="15">
                      <path
                        d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                    </svg>
                  </span>
                  <span className="my-auto">Charts </span>
                  <span className="hidden md:inline">/ Vacancy</span>
                </li>

              </ul>

              {
                homeNav === "train" && <SearchTrainHome />
              }
              {
                homeNav === "pnr" && <PnrEnquiryHome />
              }
              {
                homeNav === "chart" && <ReservationChartHome />
              }
            </div>
          </main>
      }
    </>
  )
}

export default Home