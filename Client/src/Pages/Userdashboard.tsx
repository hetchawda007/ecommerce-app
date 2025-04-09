import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Admin {
  _id: string;
  name: string;
  email?: string;
}

const Userdashboard = () => {
  const navigate = useNavigate()
  const [admins, setAdmins] = useState<Admin[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { name, adminname } = useParams<{ name: string; adminname?: string }>()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const authResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth`, {
          withCredentials: true
        });

        if (authResponse.data.message !== 'Authorized') {
          navigate('/userlogin');
          return;
        }

        if (authResponse.data.person === 'admin') {
          navigate(`/admin/${authResponse.data.name}`);
          return;
        }

        const adminsResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/getadmins`, {
          withCredentials: true
        });

        console.log("Admin response data:", JSON.stringify(adminsResponse.data, null, 2));

        if (adminsResponse.data && Array.isArray(adminsResponse.data)) {

          setAdmins(adminsResponse.data);
        } else if (adminsResponse.data && Array.isArray(adminsResponse.data.admins)) {

          setAdmins(adminsResponse.data.admins);
        } else if (adminsResponse.data && typeof adminsResponse.data === 'object') {

          const foundArray = Object.values(adminsResponse.data).find(val => Array.isArray(val));
          if (foundArray) {
            setAdmins(foundArray as Admin[]);
          } else {
            throw new Error('Could not find admin data in the response');
          }
        } else {
          throw new Error('Invalid admin data structure');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setAdmins([]);
        toast.error("Failed to load data. Please try again.", {
          position: "bottom-center"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, name]);

  const getGradient = (name: string) => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-500',
      'from-green-500 to-teal-500',
      'from-yellow-400 to-orange-500',
      'from-pink-500 to-rose-500',
      'from-red-500 to-orange-500'
    ];

    const charCode = name.charCodeAt(0) || 0;
    return gradients[charCode % gradients.length];
  };

  const renderAdmins = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sellers...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium text-gray-900">Error Loading Data</p>
          <p className="mt-1 text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!admins || admins.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium text-gray-900">No sellers found</p>
          <p className="mt-1 text-gray-500">There are currently no sellers available.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Available Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {admins.map((admin) => (
            <div
              key={admin._id || `admin-${admin.name}`}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(`/products/${admin.name}`)}
            >
              <div className={`h-24 bg-gradient-to-r ${getGradient(admin.name)} flex items-center justify-center`}>
                <div className="h-16 w-16 bg-white rounded-full border-4 border-white shadow flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {admin.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{admin.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Browse products from this seller</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/${admin.name}`);
                  }}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  View Products
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, <span className="font-semibold text-indigo-600">{name}</span></span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {renderAdmins()}
      </main>
    </div>
  );
};

export default Userdashboard