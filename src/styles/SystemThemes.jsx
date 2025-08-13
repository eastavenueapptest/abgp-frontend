import { createTheme } from "@mui/material/styles";

const SystemThemes = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#3e8841",
      "&:hover": {
        backgroundColor: "#2c652e",
      },
    },
    secondary: {
      main: "#d32f2f",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#757575",
    },
    dark: {
      primary: {
        main: "#90caf9",
      },
      secondary: {
        main: "#ff6f61",
      },
      background: {
        default: "#121212",
        paper: "#1d1d1d",
      },
      text: {
        primary: "#ffffff",
        secondary: "#b0b0b0",
      },
    },
  },
  cssVariables: {
    colorSchemeSelector: "class",
  },
});

export default SystemThemes;
