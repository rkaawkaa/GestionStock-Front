import './App.css';
import './assets/variables.css';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import Borrow from './pages/Borrow';
import Home from './pages/Home';
import Return from './pages/Return';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/borrow/:id" element={<Borrow />} />
                <Route path="/return/:id" element={<Return />} />
            </Routes>
        </div>
    );
}

export default App;


