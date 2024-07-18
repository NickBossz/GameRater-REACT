import React from 'react';
import styles from './NaoAutorizado.module.css';
import Menu from '../Menu';

function NaoAutorizado(){
  return (<>
    <Menu/>
    <div className={styles.PaginaInicial}>
      <div id={styles["welcome-container"]}>
        <h1 className={styles.textoIntroducao}>Acesso Não Autorizado</h1>
        <p className={styles.textoIntroducao}>Você não tem permissão para acessar esta página.</p>
      </div>
    </div>
  </>
  );
}

export default NaoAutorizado;