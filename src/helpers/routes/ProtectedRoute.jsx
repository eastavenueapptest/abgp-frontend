import { Navigate } from "react-router-dom";
import useGetSession from "../../hooks/auth/use-session-user";

const ProtectedRoute = ({ element, page, action }) => {
  const { data, isLoading, error } = useGetSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // error occued or no user return to login
  if (error || !data?.user) {
    return <Navigate to="/login" replace />;
  }
  //get user access properties (reference file: auth and mobile method in in usersModel.js)
  const userAccess = data.user.access || [];

  const hasAccess = (page, action) => {
    //check if my parent page has access and action
    for (const section of userAccess) {
      if (section.page === page && section.action?.includes(action)) {
        return true;
      }

      //check if parent page has subaccess
      const pageAccess = section.sub?.find?.(
        (subPage) => subPage.page === page
      );

      // and have actions
      if (pageAccess && pageAccess.action?.includes(action)) {
        return true;
      }
    }
    return false;
  };

  const isAuthorized = hasAccess(page, action);
  //if any condtion failed inside the hasAccess method will navigate to dashboard.
  if (!isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default ProtectedRoute;
