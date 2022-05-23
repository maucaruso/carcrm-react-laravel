import { Provider } from 'react-redux';
import { store } from './store/store';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routes from './Routes';

import './global.css';
import { Loading } from './view/components';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[900]
    }
  },
  props: {
    MuiTextField: {
      variant: 'outlined',
      fullWidth: true
    },
    MuiSelect: {
      variant: 'outlined',
      fullWidth: true
    }
  }
});

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Loading />
      <Routes />
    </ThemeProvider>
  </Provider>
);

export default App;

