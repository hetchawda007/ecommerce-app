import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Userlogin from './Pages/Userlogin.tsx'
import Adminlogin from './Pages/Adminlogin.tsx'
import Userdashboard from './Pages/Userdashboard.tsx'
import Admindashboard from './Pages/Admindashboard.tsx'
import Userregister from './Pages/Userregister.tsx'
import Adminregister from './Pages/Adminregister.tsx'
import NotFound from './Pages/NotFound.tsx'
import Productdashboard from './Pages/Productdashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <Router>
    <>
      <Routes>
      <Route path="/" element={<App />} />
      <Route path="/userlogin" element={<Userlogin />} />
      <Route path="/adminlogin" element={<Adminlogin />} />
      <Route path="/user/:name" element={<Userdashboard />} />
      <Route path="/products/:name" element={<Productdashboard />} />
      <Route path="/admin/:name" element={<Admindashboard />} />
      <Route path="/userregister" element={<Userregister />} />
      <Route path="/adminregister" element={<Adminregister />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  </Router>
)