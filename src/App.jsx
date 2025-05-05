
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import ShoppingCart from './pages/Cart'
import OrderHistory from './pages/OrderHistory'
import LibraryUserProfile from './pages/UserProfile'




function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/userprofile" element={<LibraryUserProfile />} />
        
      </Routes>
    </Router>
  )
}

export default App