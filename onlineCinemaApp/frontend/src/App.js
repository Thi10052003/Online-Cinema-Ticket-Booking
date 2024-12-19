import './App.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Booking from "./components/Bookings/Booking";
import Payment from "./components/Payments/Payment";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Movies from "./components/Movies/Movies";
import UserProfile from "./profile/UserProfile";
import { userActions } from "./store";

function App() {
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      dispatch(userActions.login());
    }
  }, [dispatch]);

  return (
    <div>
      <Header />
      <section>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected Routes */}
          {isUserLoggedIn && (
            <>
              <Route path="/user" element={<UserProfile />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/payment" element={<Payment />} />
            </>
          )}
        </Routes>
      </section>
    </div>
  );
}

export default App;
