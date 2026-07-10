import { Outlet } from "react-router-dom";

export default function FarmerLayout() {

    return (

        <div className="min-h-screen bg-gray-100">

            {/* Sidebar */}

            {/* Header */}

            <main>

                <Outlet />

            </main>

        </div>

    );

}