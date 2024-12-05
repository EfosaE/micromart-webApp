import { Route, Routes } from 'react-router-dom';

import RootLayout from './components/layout/RootLayout';
import Contact from './pages/Contact';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='contact' element={<Contact />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
