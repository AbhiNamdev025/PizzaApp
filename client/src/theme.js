import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6f61', // Coral/Red
      light: '#ff8e53',
      dark: '#e53935',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff8e53',
      contrastText: '#fff',
    },
    error: {
      main: '#e53935',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 20px',
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #ff6f61, #ff8e53)',
          boxShadow: '0 4px 15px rgba(255, 111, 97, 0.2)',
          '&:hover': {
            background: 'linear-gradient(45deg, #ff6f61, #ff8e53)',
            boxShadow: '0 6px 20px rgba(255, 111, 97, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#fafafa',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff6f61',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#fff',
              transform: 'translateY(-2px)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
                borderColor: '#ff6f61',
                boxShadow: '0 0 0 3px rgba(255, 111, 97, 0.1)',
              },
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 10px 25px rgba(255, 111, 97, 0.1)',
          border: '1px solid rgba(255, 111, 97, 0.1)',
        },
      },
    },
    MuiPaper: {
       styleOverrides: {
        root: {
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    }
  },
});

export default theme;
