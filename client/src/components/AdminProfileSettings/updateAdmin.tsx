/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import adminProfilestyle from "./updateAdminProfile.module.css";
import { FaPencilAlt } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import DemoNav from "../Navbar/DemoNavbar";

const baseUrl = "http://localhost:4000";

function AdminProfileSetting() {
	const [formData, setFormData] = useState({});

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const id = localStorage.getItem("signature");
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			await axios
				.patch(`${baseUrl}/users/updateUserProfile/${id}`, formData, {
					headers: {
						Authorization: `Bearer ${id}`,
					},
				})
				.then((res) => {
					toast.success(res.data.message);
					setTimeout(() => {
						window.location.href = "/user-dashboard";
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
		<div>
			<DemoNav />
			<section className={adminProfilestyle.admin_profile_sectionContainer}>
				<div
					className={
						adminProfilestyle.admin_profile_user_profileContainer_datas
					}
				>
					<div className={adminProfilestyle.admin_profile_view}>
						<h1 className={adminProfilestyle.admin_profile_viewer}>
							Profile Settings
						</h1>
					</div>
					<section
						className={adminProfilestyle.admin_profile_user_profile_section2}
					>
						<div className={adminProfilestyle.admin_profile_form}>
							{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
							<form
								className={adminProfilestyle.admin_profile_formField}
								onSubmit={handleSubmit}
							>
								<h5 className={adminProfilestyle.admin_profile_title2}>
									BASIC INFORMATION
								</h5>
								<p className={adminProfilestyle.admin_profile_text}>
									Only you can view and edit your information
								</p>
								<label className={adminProfilestyle.admin_profile_label}>
									User Name
								</label>
								<div
									className={adminProfilestyle.admin_profile_userProfile_input}
								>
									<input
										required
										className={adminProfilestyle.admin_profile_userProfile}
										type="text"
										placeholder="userName"
										name="userName"
										onChange={handleChange}
									/>
									<div className={adminProfilestyle.adminn_profile_icon1}>
										<FaPencilAlt />
									</div>
								</div>
								<label className={adminProfilestyle.admin_profile_label}>
									Phone Number
								</label>
								<div
									className={adminProfilestyle.admin_profile_userProfile_input}
								>
									<input
										required
										className={adminProfilestyle.admin_profile_userProfile}
										type="text"
										placeholder="phone"
										name="phone"
										onChange={handleChange}
									/>
									<div className={adminProfilestyle.admin_profile_icon1}>
										<FaPencilAlt />
									</div>
								</div>
								<label className={adminProfilestyle.admin_profile_label}>
									Email
								</label>
								<div
									className={adminProfilestyle.admin_profile_userProfile_input}
								>
									<input
										required
										className={adminProfilestyle.admin_profile_userProfile}
										type="text"
										placeholder="email"
										name="email"
										onChange={handleChange}
									/>
									<div className={adminProfilestyle.admin_profile_icon1}>
										<FaPencilAlt />
									</div>
								</div>
								<div className={adminProfilestyle.admin_profile_btn_contain}>
									{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
									<button
										className={adminProfilestyle.admin_profile_btn_container}
										type="submit"
									>
										Submit
									</button>
								</div>
					
							</form>
						</div>
					</section>
				</div>
			</section>
		</div>
	);
}
export default AdminProfileSetting;
