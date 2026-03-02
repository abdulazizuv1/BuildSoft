import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Contract from './pages/Contract';
import Partnership from './pages/Partnership';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateProject from './pages/CreateProject';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

function AppLayout({ children, hideFooter }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Landing /></AppLayout>} />
          <Route path="/contract" element={<AppLayout><Contract /></AppLayout>} />
          <Route path="/partnership" element={<AppLayout><Partnership /></AppLayout>} />
          <Route path="/about" element={<AppLayout><About /></AppLayout>} />
          <Route path="/login" element={<AppLayout hideFooter><Login /></AppLayout>} />
          <Route path="/signup" element={<AppLayout hideFooter><Signup /></AppLayout>} />
          <Route path="/create-project" element={<AppLayout><CreateProject /></AppLayout>} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
