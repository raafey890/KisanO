import {

    BrowserRouter,

    Routes,

    Route

} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import AuthLayout from "../layouts/AuthLayout";

import FarmerLayout from "../layouts/FarmerLayout";

import OwnerLayout from "../layouts/OwnerLayout";

import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";

import LandingPage from "../pages/public/LandingPage";

import LoginPage from "../pages/auth/LoginPage";

import RegisterPage from "../pages/auth/RegisterPage";

function FarmerDashboard() {

    return <h1>Farmer Dashboard</h1>;

}

function OwnerDashboard() {

    return <h1>Owner Dashboard</h1>;

}

function AdminDashboard() {

    return <h1>Admin Dashboard</h1>;

}

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route element={<PublicLayout />}>

                    <Route
                        path="/"
                        element={<LandingPage />}
                    />

                </Route>

                <Route element={<AuthLayout />}>

                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />

                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />

                </Route>

                <Route
                    path="/farmer"
                    element={

                        <ProtectedRoute>

                            <FarmerLayout>

                                <FarmerDashboard />

                            </FarmerLayout>

                        </ProtectedRoute>

                    }
                />

                <Route
                    path="/owner"
                    element={

                        <ProtectedRoute>

                            <OwnerLayout>

                                <OwnerDashboard />

                            </OwnerLayout>

                        </ProtectedRoute>

                    }
                />

                <Route
                    path="/admin"
                    element={

                        <ProtectedRoute>

                            <AdminLayout>

                                <AdminDashboard />

                            </AdminLayout>

                        </ProtectedRoute>

                    }
                />

            </Routes>

        </BrowserRouter>

    );

}