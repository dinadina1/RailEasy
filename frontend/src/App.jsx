import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/layout/Navbar';
import Login from './components/user/Login';
import Register from './components/user/Register';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import { Toaster } from 'react-hot-toast';
import TrainSearch from './components/searchtrain/TrainSearch';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PassengerDet from './components/searchtrain/PassengerDet';
import ReviewJourney from './components/searchtrain/ReviewJourney';
import Payment from './components/searchtrain/Payment';
import PaymentSuccess from './components/searchtrain/PaymentSuccess';
import MyBookings from './components/MyBookings';
import PnrEnquiry from './components/features/PnrEnquiry';
import TrainSchedule from './components/features/TrainSchedule';
import FareEnquiry from './components/features/FareEnquiry';
import ReservationChart from './components/features/ReservationChart';
import { HelmetProvider } from 'react-helmet-async'
import Dashboard from './components/admin/Dashboard';
import CreateTrain from './components/admin/train/CreateTrain';
import TrainsSchedule from './components/admin/train/TrainsSchedule';
import AdminTrainSearch from './components/admin/train/AdminTrainSearch';
import TrainList from './components/admin/train/TrainList';
import TrainDetail from './components/admin/train/TrainDetail';
import EditTrain from './components/admin/train/EditTrain';
import StationDetail from './components/admin/station/StationDetail';
import StationList from './components/admin/station/StationList';
import StationSchedule from './components/admin/station/StationSchedule';
import AdminStationSearch from './components/admin/station/AdminStationSearch';
import CreateStation from './components/admin/station/CreateStation';
import EditStation from './components/admin/station/EditStation';
import BookingList from './components/admin/booking/BookingList';
import AdminBookingSearch from './components/admin/booking/AdminBookingSearch';
import ManualBooking from './components/admin/booking/ManualBooking';
import DailyTransactionReport from './components/admin/DailyTransactionReport';
import BookingDetail from './components/admin/booking/BookingDetail';
import TransactionList from './components/admin/TransactionList';

function App() {

  const [bgImage, setBgImage] = useState("bg-[url('/src/assets/train_background.jpg')]");

  return (
    <>
      <main className={`bg-cover bg-center bg-fixed bg-no-repeat ${bgImage} min-h-screen`}>
        <BrowserRouter>
          <HelmetProvider>
            <Navbar />
            <Toaster />
            <Routes>
              <Route path='/' element={<Home setBgImage={setBgImage} />} />
              <Route path='/login' element={<Login setBgImage={setBgImage} />} />
              <Route path='/register' element={<Register setBgImage={setBgImage} />} />
              <Route path='/forgotpassword' element={<ForgotPassword setBgImage={setBgImage} />} />
              <Route path='/password/reset/:token' element={<ResetPassword setBgImage={setBgImage} />} />
              <Route path='/search' element={<ProtectedRoute><TrainSearch /></ProtectedRoute>} />
              <Route path='/ticket/book/passengers' element={<ProtectedRoute><PassengerDet setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/ticket/book/reviewjourney' element={<ProtectedRoute><ReviewJourney setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/ticket/book/payment' element={<ProtectedRoute><Payment setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/ticket/book/payment/success/:id' element={<ProtectedRoute><PaymentSuccess setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/mybookings' element={<ProtectedRoute><MyBookings setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/pnrenquiry' element={<ProtectedRoute><PnrEnquiry setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/trainschedule' element={<ProtectedRoute><TrainSchedule setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/fareenquiry' element={<ProtectedRoute><FareEnquiry setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/reservationchart' element={<ProtectedRoute><ReservationChart setBgImage={setBgImage} /></ProtectedRoute>} />

              {/* Admin routes */}
              <Route path='/admin/dashboard' element={<ProtectedRoute isAdmin={true}><Dashboard setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/train/create' element={<ProtectedRoute isAdmin={true}><CreateTrain setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/train/schedule' element={<ProtectedRoute isAdmin={true}><TrainsSchedule setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/train/search' element={<ProtectedRoute isAdmin={true}><AdminTrainSearch setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/train/all' element={<ProtectedRoute isAdmin={true}><TrainList setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/train/:id' element={<ProtectedRoute isAdmin={true}><TrainDetail setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/train/edit/:id' element={<ProtectedRoute isAdmin={true}><EditTrain setBgImage={setBgImage} /></ProtectedRoute>} />

              <Route path='/admin/station/:id' element={<ProtectedRoute isAdmin={true}><StationDetail setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/station/all' element={<ProtectedRoute isAdmin={true}><StationList setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/station/schedule' element={<ProtectedRoute isAdmin={true}><StationSchedule setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/station/search' element={<ProtectedRoute isAdmin={true}><AdminStationSearch setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/station/create' element={<ProtectedRoute isAdmin={true}><CreateStation setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/station/edit/:id' element={<ProtectedRoute isAdmin={true}><EditStation setBgImage={setBgImage} /></ProtectedRoute>} />

              <Route path='/admin/booking/all' element={<ProtectedRoute isAdmin={true}><BookingList setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/booking/search' element={<ProtectedRoute isAdmin={true}><AdminBookingSearch setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/booking/manual' element={<ProtectedRoute isAdmin={true}><ManualBooking setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/report/dailytransaction' element={<ProtectedRoute isAdmin={true}><DailyTransactionReport setBgImage={setBgImage} /></ProtectedRoute>} />
              <Route path='/admin/booking/:id' element={<ProtectedRoute isAdmin={true}><BookingDetail setBgImage={setBgImage} /></ProtectedRoute>} />

              <Route path='/admin/transaction/all' element={<ProtectedRoute isAdmin={true}><TransactionList setBgImage={setBgImage} /></ProtectedRoute>} />

              {/* Catch all unknown routes and redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HelmetProvider>
        </BrowserRouter>
      </main>
    </>
  )
}

export default App;
