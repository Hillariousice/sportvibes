import React, { createContext } from "react";
import { toast } from "react-toastify";
import { apiPost } from "../utils/api/axios";

interface AppContextInterface {
	name: string;
	admin: string;
	url: string;
}

export const dataContext = createContext<AppContextInterface | null>(null);

const DataProvider = ({ children }: any) => {
	/* ========= Register =========== */
	const AdminRegisterConfig = async (FormData: any) => {
		try {
			const adminRegisterData = {
				userName: FormData.userName,
				
				email: FormData.email,
				password: FormData.password,
				confirmPassword: FormData.confirmPassword,
				phone: FormData.phone,
				address: FormData.address,
				image: FormData.image,
				
			};
			await apiPost("/admin/create-admin", adminRegisterData)
				.then((res: any) => {
					toast.success(res.data.message);
					localStorage.setItem("signature", res.data.signature);
					setTimeout(() => {
						window.localStorage.href = "/verify-user";
					}, 2000);
				})
				.catch((err: any) => {
					toast.error(err.response.data.Error);
				});
				
		} catch (err) {
			console.log(err);
		}
	};

	return { AdminRegisterConfig };
};

export const useAuth = () => {
	const context = React.useContext(dataContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within the auth provider");
	}
	return context;
};
export default DataProvider;
