import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * Route guard component.
 *
 * Props:
 *  - requireAuth  (bool)   — user must be logged in
 *  - requireAdmin (bool)   — user must be an admin
 *  - redirectTo   (string) — where to send unauthorised users (default "/login")
 *  - children     (node)   — the page to render when authorised
 */
const ProtectedRoute = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  redirectTo = "/login",
}) => {
  const { user, loading, isAdmin } = useAuth();

  // Still resolving auth state — show spinner, not the page
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  // Auth required but not logged in
  if ((requireAuth || requireAdmin) && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Admin required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
