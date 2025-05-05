
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ShoppingCart from './components/Cart'
import OrderHistory from './components/OrderHistory'
import ProductPage from './components/ProductPage'
import Whishlist from './components/Whishlist'
import LibraryUserProfile from "./components/UserProfile";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from './components/home'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/userprofile" element={<LibraryUserProfile />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/ProductPage" element={<ProductPage />} />
        <Route path="/Whishlist" element={<Whishlist />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
