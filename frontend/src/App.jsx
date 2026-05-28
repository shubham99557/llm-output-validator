import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Layout from "./layout/Layout";
import SchemaCreator from "./pages/SchemaCreator";
import AIValidator from "./pages/AIValidator";
import FailureDashboard from "./pages/FailureDashboard";
import MetricsDashboard from "./pages/MetricsDashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/validator" />} />
        <Route path="schema" element={<SchemaCreator />} />
        <Route path="validator" element={<AIValidator />} />
        <Route path="failures" element={<FailureDashboard />} />
        <Route path="metrics" element={<MetricsDashboard />} />
      </Route>
    </Routes>
  );
}