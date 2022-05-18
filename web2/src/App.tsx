import { createTheme, ThemeProvider } from '@mui/material';
import Main from './features/startpage/components/Main';

const darkTheme = createTheme({
   palette: {
      mode: 'dark',
   },
});

function App() {
   return (
      <ThemeProvider theme={darkTheme}>
         <Main />
      </ThemeProvider>
   );
}

export default App;
