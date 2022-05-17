import { createTheme } from "@mui/material/styles";

const defaultTheme = {
  primary: {
    main: "#0052cc",
  },
  secondary: {
    main: "#edf2ff",
  },
};

const theme = createTheme({
  palette: {
    primary: defaultTheme.primary,
    secondary: defaultTheme.secondary,
    info: defaultTheme.secondary,
  },
});

export default theme;
