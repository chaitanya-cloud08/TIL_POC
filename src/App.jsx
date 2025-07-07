import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TILpoc from './components/TILpoc';
import PocViewer from './components/PocViewer';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TILpoc />} />
        <Route path="/poc/:pocId" element={<PocViewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;