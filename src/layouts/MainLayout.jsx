import { CssBaseline } from "@mui/material";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import logo from "../assets/images/placeholders/image.jpg";
import useLogoutUser from "../hooks/auth/use-logout-user";
import { useAuthContext } from "../hooks/context/AuthContext";
import SystemThemes from "../styles/SystemThemes";

export default function MainLayout({ modules, ...props }) {
  const { window } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const demoWindow = window ? window() : undefined;

  const { user } = useAuthContext();
  const { logout } = useLogoutUser();
  const employee = user?.user;
  const [session, setSession] = useState({
    user: {
      name: employee?.employee_name,
      email: employee?.position_name,
      image: employee?.profile || null,
    },
    org: {
      name: "MUI Inc.",
      url: "https://mui.com",
      logo: "https://mui.com/static/logo.svg",
    },
  });
  // const authentication = useMemo(() => {
  //   return {
  //     signIn: () => {
  //       setSession(session);
  //     },
  //     signOut: async () => {
  //       await logout(); // Wait for logout to finish
  //       setSession(null); // Then clear session
  //     },
  //   };
  // }, [logout]);

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession(session);
      },
      signOut: async () => {
        await logout();
        setSession(null);
      },
    };
  }, [logout, session]);

  return (
    <AppProvider
      authentication={authentication}
      session={session}
      navigation={modules}
      router={{
        pathname: location.pathname,
        searchParams: new URLSearchParams(location.search),
        navigate,
      }}
      theme={SystemThemes}
      window={demoWindow}
      branding={{
        logo: (
          <img
            src={logo}
            style={{
              borderRadius: "50%",
              width: 40,
              height: 40,
            }}
            alt="App logo"
          />
        ),
        title: "ABG",
      }}
    >
      <CssBaseline>
        <DashboardLayout>
          <PageContainer breadcrumbs={[]}>
            <Outlet />
            <ToastContainer />
          </PageContainer>
        </DashboardLayout>
      </CssBaseline>
    </AppProvider>
  );
}
