import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));

function App() {
  return (
    <Router>
      <main>
        <Suspense fallback={<div>Loading page...</div>}> { }
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;