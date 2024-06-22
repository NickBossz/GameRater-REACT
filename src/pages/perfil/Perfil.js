import React from 'react';
import styles from './Perfil.module.css';
import Menu from '../Menu';
import { useUserType } from '../../UserTypeContext';

function Perfil() {
    const { userType} = useUserType();
    
    return (
        <>
            <Menu />
            <div className={styles.Perfil}>
                <div className={styles.card} id="perfil-container">
                    <img className={styles["profile-picture"]} alt="Foto de perfil" src={process.env.PUBLIC_URL + '/fotoPerfil.png'} />
                    <h1>Bem-vindo, {userType.usuario}!</h1>
                    <p className={styles.textoIntroducao}>Cargo: {userType.cargo}</p>
                </div>
            </div>
        </>
    );
}

export default Perfil;
