import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import Layout from './pages/components/Layout';
import DiscoverPage from './pages/DiscoverPage';
import Library from './pages/Library';

function App() {
  return (
    <main
      style={{
        backgroundColor: '#202222',
      }}
      className="h-screen w-screen"
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search/:id" element={<SearchPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/library" element={<Library />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
