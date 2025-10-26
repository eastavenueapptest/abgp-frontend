import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import bgImage from "../../assets/images/background/bg-error404.jpg";
import { useAuthContext } from "../../hooks/context/AuthContext";

const Error404Page = () => {
  const [displayLink, setDisplayLink] = useState(false);
  const { user: session, isSessionLoading } = useAuthContext();

  useEffect(() => {
    if (!session) {
      setDisplayLink(true);
    }
  }, [session]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${bgImage})`,
        objectFit: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        textAlign: "center",
        padding: "0 20px", // for small screens
      }}
    >
      <div>
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "1.5rem",
            fontWeight: "400",
            color: "black",
            marginTop: "15rem",
            wordBreak: "break-word",
          }}
        >
          The page you’re looking for doesn’t exist or you don’t have permission
          to view it.{" "}
          {displayLink && (
            <>
              Go back to login <NavLink to={"/login"} />
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default Error404Page;
