import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Login from './pages/Public/Login';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { validateUser } from './redux/apis/auth';

function App() {
  const dispatch = useDispatch();

  dispatch(validateUser());
  
  return (
    <>
      <ToastContainer />
        <Router>
          <AppRoutes />
        </Router>
    </>
  );
}

export default App;
