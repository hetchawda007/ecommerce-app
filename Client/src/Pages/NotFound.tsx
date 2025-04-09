import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound: FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full text-center">

                <div className="mb-8 text-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-40 h-40 mx-auto">
                        <path fill="currentColor" d="M404.3 86c-32.6-32.6-75.7-50.6-121.8-50.6h-53c-46.1 0-89.2 18-121.8 50.6C74.9 118.5 57 161.7 57 207.7s18 89.2 50.6 121.8c32.6 32.6 75.7 50.6 121.8 50.6h53c46.1 0 89.2-18 121.8-50.6 32.6-32.6 50.6-75.7 50.6-121.8.1-46-17.9-89.2-50.5-121.7zM382.3 307.5c-12.3 12.3-26.6 22-42.6 28.8-16.6 7-34.2 10.6-52.4 10.6h-53c-18.2 0-35.8-3.5-52.4-10.6-16-6.8-30.3-16.5-42.6-28.8-12.3-12.3-22-26.6-28.8-42.6-7-16.6-10.6-34.2-10.6-52.4s3.5-35.8 10.6-52.4c6.8-16 16.5-30.3 28.8-42.6 12.3-12.3 26.6-22 42.6-28.8 16.6-7 34.2-10.6 52.4-10.6h53c18.2 0 35.8 3.5 52.4 10.6 16 6.8 30.3 16.5 42.6 28.8 12.3 12.3 22 26.6 28.8 42.6 7 16.6 10.6 34.2 10.6 52.4s-3.5 35.8-10.6 52.4c-6.8 16-16.5 30.3-28.8 42.6z" />
                        <path fill="currentColor" d="M168.8 232.7h-23.3v-23.3c0-5.5-4.5-10-10-10s-10 4.5-10 10v23.3h-23.3c-5.5 0-10 4.5-10 10s4.5 10 10 10h23.3V276c0 5.5 4.5 10 10 10s10-4.5 10-10v-23.3h23.3c5.5 0 10-4.5 10-10s-4.5-10-10-10zM386.7 135.8c-3.9-3.9-10.2-3.9-14.1 0l-93.9 93.9-93.9-93.9c-3.9-3.9-10.2-3.9-14.1 0-3.9 3.9-3.9 10.2 0 14.1l93.9 93.9-93.9 93.9c-3.9 3.9-3.9 10.2 0 14.1 2 2 4.5 2.9 7.1 2.9s5.1-1 7.1-2.9l93.9-93.9 93.9 93.9c2 2 4.5 2.9 7.1 2.9s5.1-1 7.1-2.9c3.9-3.9 3.9-10.2 0-14.1L299.9 243l93.9-93.9c3.8-3.8 3.8-10.1-.1-14.1z" />
                    </svg>
                </div>

                <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
                <h2 className="text-2xl font-medium text-gray-700 mb-6">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Go Back
                    </button>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-indigo-500 rounded-md text-white hover:bg-indigo-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
