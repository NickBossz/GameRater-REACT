import './App.css';
import PaginaInicial from './pages/pagInicial/PaginaInicial';
import Avaliacoes from './pages/avaliacoes/Avaliacoes';
import Avaliar from './pages/avaliar/Avaliar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/login/Login';
import Registrar from './pages/registrar/Registrar';
import Avaliacao from './pages/avaliacao/Avaliacao';
import { UserTypeProvider } from './UserTypeContext';
import Perfil from './pages/perfil/Perfil';
import Denuncias from './pages/denuncias/Denuncias';
import Denuncia from './pages/denuncia/Denuncia';

function App() {

  

  return (
    <Router>


      <div className="App">

        <Routes> 
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<PaginaInicial />} />
          <Route path='/avaliar' element={<Avaliar />} />
          <Route path='/avaliacoes' element={<Avaliacoes />} />
          <Route path='/registrar' element={<Registrar />} />
          <Route path="/avaliacao/:uuid" element={<Avaliacao />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/denuncias" element={<Denuncias />} />
          <Route path="/denuncia/:uuid" element={<Denuncia />} />

        </Routes>



      </div>
    </Router>
  );
}

const Root = () => (
  <UserTypeProvider>
    <App />
  </UserTypeProvider>
);


export default Root;
