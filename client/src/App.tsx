import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css'
import Login from "./pages/logins/Login";
import Register from "./pages/Register/Register";
import AdminsSignup from "./pages/AdminSignup/AdminSignup";
import MailSent from "./pages/SentMail/MailSent";
import ResetPasswordd from "./pages/ResetPassword/ResetPassword";
import ProfileSetting from "./pages/ProfileSetting/ProfileSetting";
import { ToastContainer } from "react-toastify";
import ForgetPasswordCard from "./components/fPassCard/fPassCard";
import { ProtectUserRoute, ProtectAdminRoute } from "./context/ProtectRoute";
import Verifyuser from "./pages/Verifyuser/Verifyuser";


// setup  for fontend

const App = () => {
	return (
		<React.Fragment>
			<ToastContainer />
			<Router>
				<Routes>
					
					<Route path="/login" element={<Login />} />
					<Route path="/" element={<Register />} />
					<Route path="/admin-signup" element={<AdminsSignup />} />
					<Route path="/sentmail" element={<MailSent />} />
					<Route path="/forgotpassword" element={<ForgetPasswordCard />} />
					<Route path="/verifyuser" element={<Verifyuser/>} />
					<Route
						path="/users/resetpassword"
						element={<ResetPasswordd />}
					/>
					<Route path="/profilesetting" element={<ProfileSetting />} />
					
					<Route
						path="/user-profilesetting"
						element={
							<ProtectUserRoute>
								<ProfileSetting />
							</ProtectUserRoute>
						}
					/>
				
				</Routes>
			</Router>
		</React.Fragment>
	);
};

export default App;
