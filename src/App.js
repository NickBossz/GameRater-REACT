import './App.css';
import Analises from './pages/analises/Analises.js';
import Comunidade from './pages/comunidade/Comunidade.js';
import Home from './pages/home/Home.js';
import Jogo from './pages/jogo/Jogo.js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserTypeProvider } from './UserTypeContext.js';
import Perfil from './pages/perfil/Perfil.js';
import {NotificationProvider} from './pages/NotificationManager.js';
import Analise from './pages/analise/Analise.js';

function App() {
  return (


    <Router>
      <NotificationProvider>
      <div className="App">

        <Routes>
           <Route path="/" element={<Navigate to="/home" />} />
          <Route path='/home' element={<Home />}></Route>
          <Route path='/analises' element={<Analises />}></Route>
          <Route path='/comunidade' element={<Comunidade />}></Route>
          <Route path='/jogo/:id' element={<Jogo />}></Route>
          <Route path='/perfil/:username' element={<Perfil />}></Route>
          <Route path='/analise/:id' element={<Analise />}></Route>

        </Routes>
      </div>
      </NotificationProvider>
    </Router>

  );
}

const Root = () => (
  <UserTypeProvider>
    <App />
  </UserTypeProvider>
);


export default Root;
