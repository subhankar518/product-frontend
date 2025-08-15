import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import UserDashboard from "./features/dashboard/UserDashboard";
import AdminDashboard from "./features/dashboard/AdminDashboard";
import ProductList from "./features/products/ProductList";
import ProductCreate from "./features/products/ProductCreate";
import OrderCreate from "./features/orders/OrderCreate";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
    return (
        <div>
            <Navbar />
            <div className="container py-4">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        element={
                            <PrivateRoute allowedRoles={["user", "admin"]} />
                        }
                    >
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/orders/new" element={<OrderCreate />} />
                    </Route>

                    <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route
                            path="/products/new"
                            element={<ProductCreate />}
                        />
                    </Route>

                    <Route path="*" element={<p>Hi</p>} />
                </Routes>
            </div>
        </div>
    );
}
