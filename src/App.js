import { Login } from './Components/Login';
import { Dashboard } from './Components/Dashboard';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div>
      {isAuthenticated ? (
        <Dashboard/>) : (
        <Login/>
      )}
    </div>
  );
}

export default App;
