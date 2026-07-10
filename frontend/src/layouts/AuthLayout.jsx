import { Outlet } from "react-router-dom";

export default function AuthLayout() {

    return (

        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex justify-center items-center p-6">

            <Outlet />

        </div>

    );

}