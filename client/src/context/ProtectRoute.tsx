import { useLocation, Navigate } from "react-router-dom";

export const ProtectUserRoute = ({ children }: any) => {
	const location = useLocation();
	const isAuthenticated = localStorage.getItem("signature");
	const userRole = localStorage.getItem("role");

	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (!isAuthenticated || !(userRole === "user")) {
		return <Navigate to="/login" state={{ from: location }} />;
	}
	return children;
};

export const ProtectAdminRoute = ({ children }: any) => {
	const location = useLocation();
	const isAuthenticated = localStorage.getItem("signature");
	const userRole = localStorage.getItem("role");

	// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
	if (!isAuthenticated || !(userRole === "admin")) {
		return <Navigate to="/login" state={{ from: location }} />;
	}
	return children;
};
