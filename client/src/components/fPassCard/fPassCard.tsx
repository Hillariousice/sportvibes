/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./fPassCard.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const baseUrl = "http://localhost:4000";

const ForgetPasswordCard = () => {
	const [createForm, setCreateForm] = useState({});
	const submitDetails = (e: any) => {
		e.preventDefault();
		const { name, value } = e.target;
		console.log({ name, value });
		setCreateForm({
			...createForm,
			[name]: value,
		});
	};
	const fetchLink = async () => {
		try {
			console.log("async function");
			await axios
				.post(`${baseUrl}/users/forgotpassword`, createForm)
				.then((res) => {
					toast.success(res.data.message);
					setTimeout(() => {
						console.log(res.data);
					}, 10000);
				})
				.catch((err) => {
					toast.error(err.response.data.Error);
					console.log(err);
				});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="h">
			<form className="" onSubmit={fetchLink}>
				<div className="gig">
				<div className="">
					<p className="ti">Forgot Password</p>
					<div className="">
						<p className="yi">
							Enter the email associated with your account and we’ll send an
							email with instruction to reset your password
						</p>
					</div>
				</div>
				<div>
					<label className="">Email:</label>
					<br />
					<input
						type="email"
						placeholder="Email"
						className="firs"
						name="email"
						onChange={submitDetails}
					/>
				</div>

				<div>
					<button className="resetBtn" type="submit">
						<Link  className="ilink"to="/sentmail">Reset Password</Link>
					</button>
				</div>
				<div>
					<div className="backLog">
						<Link className="ilink" to="/">Back to Login</Link>
					</div>
				</div>
				</div>
			</form>
		</div>
	);
};

export default ForgetPasswordCard;
