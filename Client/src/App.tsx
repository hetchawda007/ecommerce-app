import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth`, {
          withCredentials: true
        });
        console.log(response.data);
        if (response.data.message !== 'Authorized') {
          return navigate('/userlogin');
        }
        if (response.data.person === 'admin') {
          return navigate(`admin/:${response.data.name}`);
        } else {
          return navigate(`user/:${response.data.name}`);
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        return navigate('/userlogin');
      }
    };
    validateUser();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Loading...</p>
    </div>
  );
};

export default App;