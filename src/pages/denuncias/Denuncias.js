import React, { useState, useEffect } from 'react';
import styles from './Denuncias.module.css';
import axios from 'axios';
import Menu from '../Menu';
import { Link } from 'react-router-dom';
import { useUserType } from '../../UserTypeContext';

function Denuncias() {
  const [denuncias, setDenuncias] = useState([]);
  const { userType } = useUserType();

  useEffect(() => {
    async function fetchDenuncias(){

        try {
            const response = await axios.get("http://localhost:8080/denuncias");
            setDenuncias(response.data);
        } catch (e) {
            window.alert("ERRO");
        }

    }
    
    fetchDenuncias()

    if (userType == null || userType.cargo !== "FUNCIONARIO") {
      window.history.pushState({}, '', '/naoautorizado');
      window.location.reload();
    }
  }, [userType]);


    function truncateText(text, limit) {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  };



  return (<>
    <Menu/>

    <div className={styles.container}>
      <h1 className={styles.titulo}>Denúncias</h1>
      <div className={styles.denunciasContainer}>
        {denuncias.map((denuncia, index) => (
          <>
          <Link to={"/denuncia/" + denuncia.id} className={styles.noUnderline}>
   
            <div
              key={index}
              className={styles.denunciaCard}
            >
              <h3 className={styles.denunciaTitulo}>{denuncia.feitapor}</h3>
              <p className={styles.denunciaMotivo}>Motivo: {truncateText(denuncia.motivodenuncia, 30)}</p>
            </div>
          </Link>

          </>
        ))}
      </div>
    </div>

  </>);
}

export default Denuncias;
