import { useEffect } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Authchecker = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const validateUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth`, {
                    withCredentials: true
                });
                if (response.data.person === 'admin') {
                    return navigate(`admin/:${response.data.name}`);
                } else {
                    return navigate(`user/:${response.data.name}`);
                }
            } catch (error) {
                console.error('Token validation failed:', error);
            }
        };
        validateUser();
    }, [navigate]);
    return null
}

export default Authchecker