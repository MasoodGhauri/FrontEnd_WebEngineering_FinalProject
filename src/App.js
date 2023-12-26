import './App.css';
import './Masood.css';
import './Saaram.css';
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Components/Adnan/Login/Login";
import Signup from "./Components/Adnan/Signup/Signup";
import SubscriptionDetail from "./Components/Adnan/Subscription/SubscriptionDetail";
import Profilesetting from "./Components/Adnan/HomePage/ProfilePage";
import AdminHomePage from "./Components/Adnan/HomePage/AdminHomePage";
import SuperAdminPage from "./Components/Adnan/HomePage/SuperAdminPage";


function App() {

  //const user = localStorage.getItem("token");
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/signup" exact element={<Signup />} />
    <Route path="/login" exact element={<Login />} />
    <Route path="/Subscriptiondetails" exact element={<SubscriptionDetail />} />  
    <Route path="/Profilesetting" exact element={<Profilesetting />} />
    <Route path="/AdminHomePage" exact element={<AdminHomePage />} />
    <Route path="/SuperAdminPage" exact element={<SuperAdminPage />} />
    {/* <Route path="/StudentHomePage" exact element={<HomePageStudent />} /> */}
    <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
