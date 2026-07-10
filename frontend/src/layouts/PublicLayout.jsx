import { Outlet } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-[#F8FAF5]">

            {/* Navbar */}

            <main>

                <Outlet />

            </main>

            {/* Footer */}

        </div>
    );
}