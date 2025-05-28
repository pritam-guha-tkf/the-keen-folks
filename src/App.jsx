import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';
import contentfulClient, { isPreviewMode } from './contentfulClient';

const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const MenuItemDetailPage = lazy(() => import('./pages/MenuItemDetailPage'));

const APP_LOCALE = 'en-US';

function App() {
  const inPreview = isPreviewMode();

  return (
    <Router>
      <ContentfulLivePreviewProvider
        locale={APP_LOCALE}
        enableInspectorMode={inPreview}
        enableLiveUpdates={inPreview}
        debugMode={inPreview}
      >
        <main> { }
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading page...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              { }
              <Route path="/menu-item/:itemSlug" element={<MenuItemDetailPage />} />
            </Routes>
          </Suspense>
        </main>
      </ContentfulLivePreviewProvider>
    </Router>
  );
}

export default App;