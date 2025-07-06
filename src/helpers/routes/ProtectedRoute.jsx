import { Navigate } from "react-router-dom";
import useGetSession from "../../hooks/auth/use-session-user";

const ProtectedRoute = ({ element, page, action }) => {
  const { data, isLoading, error } = useGetSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data?.user) {
    return <Navigate to="/login" replace />;
  }

  const userAccess = data.user.access || [];

  const hasAccess = (page, action) => {
    for (const section of userAccess) {
      if (section.page === page && section.action?.includes(action)) {
        return true;
      }

      const pageAccess = section.sub?.find?.(
        (subPage) => subPage.page === page
      );
      if (pageAccess && pageAccess.action?.includes(action)) {
        return true;
      }
    }
    return false;
  };

  const isAuthorized = hasAccess(page, action);
  // console.log("User access:", userAccess);

  if (!isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default ProtectedRoute;
