import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import HomePage from "./pages/HomePage";
import CataloguePage from "./pages/CataloguePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { InquiryFormPage, CartPage } from "./pages/EnquiryPages";
import { AccountPage, B2BPage, SimplePage } from "./pages/BusinessPages";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountDataPage from "./pages/AccountDataPage";

const Static = ({ title, eyebrow, children }) => <SimplePage title={title} eyebrow={eyebrow}>{children}</SimplePage>;
function App() { return <BrowserRouter><AuthProvider><CartProvider><SiteLayout><Routes>
  <Route path="/" element={<HomePage />} /><Route path="/products" element={<CataloguePage />} /><Route path="/products/:id" element={<ProductDetailPage />} />
  <Route path="/rice" element={<CataloguePage category="RICE" />} /><Route path="/spices" element={<CataloguePage category="SPICES" />} /><Route path="/masalas" element={<CataloguePage category="MASALAS" />} />
  <Route path="/b2b" element={<B2BPage />} /><Route path="/request-quote" element={<InquiryFormPage kind="quote" />} /><Route path="/request-sample" element={<InquiryFormPage kind="sample" />} /><Route path="/register" element={<RegisterPage />} /><Route path="/distributor" element={<InquiryFormPage kind="distributor" />} /><Route path="/export" element={<InquiryFormPage kind="export" />} /><Route path="/contact" element={<InquiryFormPage kind="contact" />} />
  <Route path="/cart" element={<CartPage />} /><Route path="/login" element={<LoginPage />} /><Route path="/account" element={<AccountPage />} />
  <Route path="/account/quotes" element={<AccountDataPage section="quotes" />} /><Route path="/account/samples" element={<AccountDataPage section="samples" />} /><Route path="/account/orders" element={<AccountDataPage section="orders" />} /><Route path="/account/business" element={<AccountDataPage section="business" />} /><Route path="/account/addresses" element={<AccountDataPage section="addresses" />} />
  <Route path="/about" element={<Static eyebrow="About" title="Built for the next chapter of Rizoura Foods."><p>Rizoura Foods is developing a business-to-business food procurement experience around rice, spices and masalas. Product and commercial information is confirmed directly with buyers.</p></Static>} /><Route path="/quality" element={<Static eyebrow="Quality" title="Quality information that is specific, not assumed."><p>Raw material sourcing, cleaning, processing, grinding, blending, packaging and batch control are important parts of a food product’s journey. Product-level testing and certification data will be displayed only when verified information is available.</p></Static>} />
  <Route path="*" element={<Static eyebrow="Not found" title="This page is not available."><p>Please return to the catalogue or contact Rizoura Foods.</p></Static>} />
</Routes></SiteLayout></CartProvider></AuthProvider></BrowserRouter>; }
export default App;
