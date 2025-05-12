import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ShoppingCart from "./components/Cart";
import OrderHistory from "./components/OrderHistory";
import ProductPage from "./components/ProductPage";
import Whishlist from "./components/Whishlist";
import LibraryUserProfile from "./components/UserProfile";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminBook from "./components/AdminBook";
import Order from "./components/Order";
import ItemDetails from "./components/ItemDetail";
import AdminOrderPage from "./components/AdminOrder";
import AdminBanner from "./components/AdminBanner";
import { NotificationProvider } from "./context/NotificationContext"; // Make sure this path is correct


// Component to handle conditional rendering of Header and Footer
function Layout() {
  const location = useLocation();
  // Normalize pathname to handle case sensitivity and trailing slashes
  const pathname = location.pathname.toLowerCase().replace(/\/$/, "");
  const excludeHeaderFooter = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!excludeHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/userprofile" element={<LibraryUserProfile />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/productpage" element={<ProductPage />} />
        <Route path="/whishlist" element={<Whishlist />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/adminbook" element={<AdminBook />} />
        <Route path="/adminorder" element={<AdminOrderPage />} />
        <Route path="/adminbanner" element={<AdminBanner />} />
        <Route path="/order" element={<Order/>} />
        <Route path="/books/:id" element={<ItemDetails/>} />
      </Routes>
      {!excludeHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
            <NotificationProvider>

      <Router>
        <Layout />
        <ToastContainer />
      </Router>
                  </NotificationProvider>

    </AuthProvider>
  );
}

export default App;
