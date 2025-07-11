import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate,} from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import HomePage from './components/HomePage/HomePage';
import Profile from './components/Profile/Profile';
import AddGamePage from './components/AddGame/AddGamePage';
import Header from './components/Header/Header';
import UsersPage from './components/Users/UsersPage';
import UserView from './components/Users/UserView';
import EditGamePage from './components/AddGame/EditGamePage';
import './App.css';
import './components/AddGame/AddGamePage.css'; 
import './components/Auth/Auth.css';
import './components/Header/Header.css';
import './components/HomePage/HomePage.css';
import './components/Profile/Profile.css'; 
import './components/Users/Users.css'; 




function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth) {
      setIsAuthenticated(JSON.parse(storedAuth));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
        <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} /> {/* ADD HEADER HERE */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/home"
          element={<HomePage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile handleLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/addgame/:gameName"
          element={isAuthenticated ? <AddGamePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/edit-game/:gameId"
          element={
            isAuthenticated ? <EditGamePage /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:userId" element={<UserView />} />
      
      </Routes>
    </Router>
  );
}

export default App;
