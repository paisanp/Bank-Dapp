import './App.css';
import Homepage from './Pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Homepage /> }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
