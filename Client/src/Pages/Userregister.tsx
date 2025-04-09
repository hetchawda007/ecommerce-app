import { useState, useEffect } from "react"
import { Link } from "react-router"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'motion/react'
import { useNavigate } from "react-router-dom"
import axios from "axios";

const Userregister = () => {
  const navigate = useNavigate()
  const [form, setform] = useState({ username: "", password: "" })
  const [eye, setEye] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth`, {
          withCredentials: true
        });
        if (response.data.message !== 'Authorized') return
        if (response.data.person === 'admin') {
          return navigate(`/admin/${response.data.name}`);
        } else {
          return navigate(`/user/${response.data.name}`);
        }
      } catch (error) {
        console.error('Token validation failed:', error);
      }
    };
    validateUser();
  }, [navigate]);

  const handlechanghe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setform({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters long', {
        position: "bottom-center",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/user/register`, { name: form.username, password: form.password })
      if (res.status === 201) {
        navigate(`/userlogin`);
      }
      else {
        toast.error('User already exists', {
          position: "bottom-center",
        });
      }
      setform({ username: "", password: "" });
    } catch (error) {
      console.error('Register error:', error);
      setLoading(false);
      toast.error('Register failed. Please check your credentials.', {
        position: "bottom-center",
      });
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />

      <motion.div className="flex flex-col my-10 rounded-xl items-center mx-auto w-1/2 bg-white px-8 py-10 max-md:px-4 max-md:w-full"
        initial={animate === false ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        onAnimationComplete={() => setAnimate(true)}
      >
        <div className="flex justify-center items-center gap-8 w-full">
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl font-semibold text-[#262626]">Register account</div>
            <div className="text-[#4C4C4D] max-md:text-center">Please Register your new account</div>
          </div>
          <Link to={'/adminlogin'}><button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Admin login</button></Link>
        </div>
        <form className="self-start flex flex-col gap-4 w-full mt-10" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 w-full">
            <label className="text-[#262626] font-semibold" htmlFor="name">Username</label>
            <input onChange={handlechanghe} value={form.username} className="placeholder:text-[#656567] text-[#656567] p-3 outline-[#FF9500] rounded-lg w-full bg-[#FCFCFD] border border-[#F1F1F3]" type="text" name="username" id="username" placeholder="Enter your Username" px-5 py-3 />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <label className="text-[#262626] font-semibold" htmlFor="name">Password</label>
            <input onChange={handlechanghe} value={form.password} className="placeholder:text-[#656567] text-[#656567] p-3 outline-[#FF9500] rounded-lg w-full bg-[#FCFCFD] border border-[#F1F1F3]" type={eye ? "text" : "password"} name="password" id="name" placeholder="Enter your Password" px-5 py-3 />
            <div className="h-0 relative bottom-[46px] self-end right-4">
              {eye === true ? <img className="h-5 w-auto cursor-pointer" onClick={() => setEye(!eye)} src="/eye.png" alt="eye" />
                : <img className="h-5 w-auto cursor-pointer" onClick={() => setEye(!eye)} src="/hidden.png" alt="eye" />}
            </div>
          </div>
          <button
            className="bg-[#FF9500] transition-all duration-300 text-white py-[10px] disabled:bg-[#bb8130] rounded-lg hover:bg-[#e38602] flex justify-center"
            type="submit"
            disabled={!form.username || !form.password || loading}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="w-full items-center my-8 flex gap-2">
          <div className="h-[2px] w-full bg-[#E4E4E7]"></div>
          <div className="text-[#98989A]">OR</div>
          <div className="h-[2px] w-full bg-[#E4E4E7]"></div>
        </div>
        <div className="flex items-center gap-2 my-5">
          <div>Already have an account?</div>
          <Link className="flex gap-2 items-center" to={'/userlogin'}><div className="underline">Login</div><img className="h-3 w-auto" src="arrow-3.png" alt="arrow" /></Link>
        </div>
      </motion.div>
    </>
  )
}

export default Userregister