import { createContext, useContext, useEffect, useState } from "react";
import useGetSession from "../auth/use-session-user";

const AuthContext = createContext({
  user: null,
  refresh: async () => {},
  sessionError: null,
  isSessionLoading: true,
});

const AuthProvider = ({ children }) => {
  const {
    data: user,
    isLoading: isSessionLoading,
    refresh,
    error: sessionError,
  } = useGetSession();

  console.log(user);

  const [sessionErrorState, setSessionErrorState] = useState(sessionError);
  useEffect(() => {
    setSessionErrorState(sessionError);
  }, [sessionError]);

  return (
    <AuthContext.Provider
      value={{
        user,
        refresh,
        sessionError: sessionErrorState,
        isSessionLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuthContext };
