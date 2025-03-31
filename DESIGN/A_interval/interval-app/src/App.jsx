import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { IntervalProvider } from './context/IntervalContext';
import Page0Start from './pages/Page0Start';
import Page1 from './pages/Page1';
import Page2PatternSetup from './pages/Page2PatternSetup';
import Page3DetailSetup from './pages/Page3DetailSetup';
import Page4Summary from './pages/Page4Summary';
import Page5Result from './pages/Page5Result';

function App() {
  return (
    <IntervalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Page0Start />} />
          <Route path="/setup-count" element={<Page1 />} /> {/* ✅ 추가됨 */}
          <Route path="/setup-pattern" element={<Page2PatternSetup />} />
          <Route path="/setup-details" element={<Page3DetailSetup />} />
          <Route path="/summary" element={<Page4Summary />} />
          <Route path="/result" element={<Page5Result />} />
        </Routes>
      </Router>
    </IntervalProvider>
  );
}

export default App;
