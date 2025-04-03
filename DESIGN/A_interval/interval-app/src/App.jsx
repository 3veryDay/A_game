import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { IntervalProvider } from './context/IntervalContext';
import Page0Start from './interval_setup_pages/Page0Start';
import Page1 from './interval_setup_pages/Page1';
import Page2PatternSetup from './interval_setup_pages/Page2PatternSetup';
import Page3DetailSetup from './interval_setup_pages/Page3DetailSetup';
import Page4Summary from './interval_setup_pages/Page4Summary';
import Page5Result from './interval_setup_pages/Page5Result';
import DashboardPage from './Login page/DashboardPage';
import LoginPage from './Login page/Login_spotify';

import MusicPlayerPage from './MusicPlayPages/MusicPlayerPage';

import MusicLabPage from './MusicPlayPages/MusicLabPage';
import MusicLabPage2 from './MusicPlayPages/MusicLabPage2';
function App() {
  return (
    <IntervalProvider>
      <Router>
        <Routes>
    
          <Route path="/page0" element={<Page0Start />} />
          <Route path= "/" element = {<LoginPage />} />
          <Route path="/dashboard" element = {<DashboardPage/>}/>
          <Route path="/setup-count" element={<Page1 />} />
          <Route path="/setup-pattern" element={<Page2PatternSetup />} />
          <Route path="/setup-details" element={<Page3DetailSetup />} />
          <Route path="/summary" element={<Page4Summary />} />
          <Route path="/result" element={<Page5Result />} />


          <Route path="/play" element = {<MusicPlayerPage />} />


          <Route path="/music-lab" element={<MusicLabPage />} />
          <Route path="/music-lab-interval" element={<MusicLabPage2  />} />

        </Routes>
      </Router>
    </IntervalProvider>
  );
}

export default App;