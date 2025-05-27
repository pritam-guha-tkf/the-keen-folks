import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';
import { isPreviewMode } from './contentfulClient';

const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const APP_LOCALE = 'en-US';

function App() {
  const inPreview = isPreviewMode();

  return (
    <Router>
      { }
      { }
      <ContentfulLivePreviewProvider
        locale={APP_LOCALE}
        enableInspectorMode={inPreview}
        enableLiveUpdates={inPreview}
        debugMode={inPreview}
      >
        <main>
          <Suspense fallback={<div>Loading page...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
            </Routes>
          </Suspense>
        </main>
      </ContentfulLivePreviewProvider>
    </Router>
  );
}

export default App;