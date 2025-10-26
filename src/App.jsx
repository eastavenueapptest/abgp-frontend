import { Dashboard, Person } from "@mui/icons-material";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import OverviewPage from "./pages/dashboard/OverviewPage";
import LoginPage from "./pages/login/LoginPage";

import ABGFormPage from "./pages/medical-record/form/ABGFormPage";
import CreateRequestPage from "./pages/medical-record/request/CreateRequestPage";
import RequestPage from "./pages/medical-record/request/RequestPage";
import ViewRequestPage from "./pages/medical-record/request/ViewRequestPage";
import ScannedResultPage from "./pages/medical-record/scanned/ScannedResultPage";

import CreateUserPage from "./pages/users/CreateUserPage";
import UsersPage from "./pages/users/UsersPage";

import { ThemeProvider } from "@emotion/react";
import { updatePageVisibility } from "./helpers/routes/PermissionRoute";
import ProtectedRoute from "./helpers/routes/ProtectedRoute";
import { useAuthContext } from "./hooks/context/AuthContext";
import Error404Page from "./pages/block/Error404Page";
import LoadingScreen from "./pages/block/LoadingScreen";
import ResetPage from "./pages/login/Resetpage";
import UpdatePasswordPage from "./pages/users/UpdatePasswordPage";
import ViewUserPage from "./pages/users/ViewUserPage";
import SystemThemes from "./styles/SystemThemes";

const App = () => {
  const pages = useMemo(
    () => [
      { kind: "header", title: "Main items" },
      { segment: "dashboard", title: "Dashboard", icon: <Dashboard /> },
      { segment: "users", title: "Users", icon: <Person /> },
      { kind: "divider" },
      { kind: "header", title: "Features" },
      {
        segment: "medical-records",
        title: "Medical Record",
        icon: <BarChartIcon />,
        children: [
          { segment: "request", title: "Request", icon: <DescriptionIcon /> },
          {
            segment: "scanned-result",
            title: "Scanned Result",
            icon: <DescriptionIcon />,
          },
          { segment: "abg-form", title: "ABG Form", icon: <DescriptionIcon /> },
        ],
      },
      { segment: "census", title: "Census", icon: <LayersIcon /> },
    ],
    []
  );
  const { user: session, isSessionLoading } = useAuthContext();
  const [visiblePages, setVisiblePages] = useState();

  useEffect(() => {
    const updateVisibility = async () => {
      if (session?.user?.access) {
        const visiblePages = await updatePageVisibility(
          pages,
          session.user.access
        );
        setVisiblePages(visiblePages);
      }
    };

    updateVisibility();
  }, [session, pages]);

  if (isSessionLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route element={<MainLayout modules={visiblePages} />}>
        <Route
          path="/dashboard"
          index
          element={
            <ProtectedRoute
              page="dashboard"
              action="read"
              element={<OverviewPage />}
            />
          }
        />

        <Route path="users">
          <Route
            index
            element={
              <ProtectedRoute
                page="users"
                action="read"
                element={<UsersPage />}
              />
            }
          />
          <Route path="create" element={<CreateUserPage />} />
          <Route path="update-password" element={<UpdatePasswordPage />} />
          <Route
            path="view/:id"
            element={
              <ProtectedRoute
                page="users"
                action="read"
                element={<ViewUserPage />}
              />
            }
          />
        </Route>

        <Route path="medical-records">
          <Route
            path="request"
            element={
              <ProtectedRoute
                page="request"
                action="read"
                element={<RequestPage />}
              />
            }
          />
          <Route
            path="request/create"
            element={
              <ProtectedRoute
                page="request"
                action="create"
                element={<CreateRequestPage />}
              />
            }
          />
          <Route
            path="request/view/:id"
            element={
              <ProtectedRoute
                page="request"
                action="read"
                element={<ViewRequestPage />}
              />
            }
          />
          <Route
            path="scanned-result"
            element={
              <ProtectedRoute
                page="scanned-result"
                action="read"
                element={<ScannedResultPage />}
              />
            }
          />
          <Route
            path="abg-form"
            element={
              <ProtectedRoute
                page="abg-form"
                action="read"
                element={<ABGFormPage />}
              />
            }
          />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/abgp-frontend" replace />} />

      <Route
        path="/abgp-frontend"
        element={
          <ThemeProvider theme={SystemThemes}>
            <LoginPage />
          </ThemeProvider>
        }
      />
      <Route
        path="/setup-new-password"
        element={
          <ThemeProvider theme={SystemThemes}>
            <ResetPage />
          </ThemeProvider>
        }
      />

      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
};

export default App;
