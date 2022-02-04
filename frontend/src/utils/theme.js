import { createTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1E8F9E',
    },
    secondary: {
      main: '#EB8F49',
    },
    error: {
      main: '#EB716A',
    },
    success: {
      main: '#559E72'
    },
    background: {
      default: '#F3F3F3',
    },
  },
});

export default theme;
