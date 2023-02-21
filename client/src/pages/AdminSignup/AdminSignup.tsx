import { useState } from "react";
import styled from "./AdminSignupForm.module.css";
import adminImage from "../../assets/admins_signup_assets/admin_image.svg";
import BikeLogo from "../../assets/admins_signup_assets/bike_icon.svg";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const baseUrl = "http://localhost:4000";

const AdminSignup = () => {
	const [dataValues, setDataValues] = useState<Record<string, any>>({});

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setDataValues({ ...dataValues, [name]: value });
	};

	const handleImageChange = (e: any) => {
		const { name } = e.target;
		const file = e.target.files[0];
		if (file.size > 1000000) {
			toast.error("file is too large");
			return;
		}
		// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
		if (!file.type.includes("image")) {
			toast.error("File must be an image");
		}
		setDataValues({ ...dataValues, [name]: file });
	};
	console.log("data", dataValues);
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		// console.log("this is formDatat", formData);
		const formData = new FormData();
		formData.append("email", dataValues.email);
		formData.append("name", dataValues.name);
		formData.append("phone", dataValues.phone);
		formData.append("password", dataValues.password);
		formData.append("confirmPassword", dataValues.confirmPassword);
		formData.append("image", dataValues.image);
		
		try {
			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};
			await axios
				.post(`${baseUrl}/admins/create-admin`, formData, config)
				.then((res) => {
					const signature = res.data.signature;
					localStorage.setItem("signature", signature);
					toast.success(res.data.message);
					setTimeout(() => {
						window.location.href = "/login";
					}, 2000);
				})
				.catch((err) => {
					console.log(err);
					toast.error(err.response.data.Error);
				});
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className={styled.admin_Signup_container}>
			<div className={styled.image_container}>
				<img src={adminImage} alt="placeholder_image_admins_signup_form" />
				<p className={styled.cp}>
					Sport everyday....
				</p>
			</div>
			<div className={styled.signup_form_field_container}>
				<div className={styled.form_bx}>
					{/* ---------- LOGO ---------- */}
					<Link to="/" style={{ textDecoration: "none" }}>
						<div className={styled.adminSignUpLogo}>
							<div className={styled.logo_image}>
								<span>
									<img
										src={BikeLogo}
										alt="placeholder_image_admins_signup_form"
									/>
								</span>
							</div>
							<div className={styled.desc}>Sportvibes Admin</div>
						</div>
					</Link>
					<h3 className={styled.sub_title}>Sign Up as a Admin</h3>
					{/* -------------- FORM -------------- */}
					<form className={styled.admin_SignUp_form}>
						<div className={styled.form_elem}>
							<i className="fa fa-user icon"></i>
							<label htmlFor="name" className={styled.admin_signup_label}>
								User Name
							</label>
							<input
								type="text"
								name="userName"
								placeholder="Enter your user name"
								onChange={handleChange}
							/>
						</div>
						<div className={styled.form_elem}>
							<i className="fa fa-phone icon"></i>
							<label htmlFor="phone" className={styled.admin_signup_label}>
								Phone Number
							</label>
							<input
								type="phone"
								name="phone"
								placeholder="Enter your phone number"
								onChange={handleChange}
							/>
						</div>
						<div className={styled.form_elem}>
							<i className="fa fa-envelope icon"></i>
							<label className={styled.admin_signup_label} htmlFor="email">
								Email
							</label>
							<input
								type="email"
								name="email"
								placeholder="Enter your email"
								onChange={handleChange}
							/>
						</div>
						
						
						
						<div className={styled.form_elem}>
							<i className="fa fa-lock icon"></i>
							<label className={styled.admin_signup_label} htmlFor="Password">
								Password
							</label>
							<input
								type="password"
								name="password"
								placeholder="Enter your Password"
								onChange={handleChange}
							/>
						</div>
						<div className={styled.form_elem}>
							<i className="fa fa-lock icon"></i>
							<label
								className={styled.admin_signup_label}
								htmlFor="confirmPassword"
							>
								Confirm Password
							</label>
							<input
								type="password"
								name="confirmPassword"
								placeholder="Enter your Password"
								onChange={handleChange}
							/>
						</div>
						<div className={styled.form_elem}>
							<i className="fa fa-city icon"></i>
							<label
								className={styled.rider_signup_label}
								htmlFor="image"
							>
								Profile Image
							</label>
							<input
								type="text"
								id="image"
								name="image"
								placeholder="Image"
								onChange={handleChange}
							/>
						</div>

						<div className="btn-container">
							{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
							<button className={styled.buttonReg} onClick={handleSubmit}>
								Signup
							</button>
						</div>
					
						<p className={styled.signin}>
							Already have an account?
							<a>
								<Link to="/login" style={{ textDecoration: "none" }}>
									<span className="signin" style={{ textAlign: "center" }}>
										Sign In
									</span>
								</Link>
							</a>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};
export default AdminSignup;
