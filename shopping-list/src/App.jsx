import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";


const ShoppingListDetail = React.lazy(() => import("./pages/ShoppingListDetail.jsx"));

export default function App() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/list/:id" element={<ShoppingListDetail />} />
            </Routes>
        </React.Suspense>
    );
}