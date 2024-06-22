import React from 'react';
import styles from './PaginaInicial.module.css';
import Menu from '../Menu';

function PaginaInicial() {
    return (
        <>
            <Menu />
            <div className={styles.PaginaInicial}>
                <div id="welcome-container">
                    <h1>GameRater</h1>
                    <div>
                        <span className={styles.textoIntroducao}>
                            Um site onde você pode fazer e ver avaliações de jogos!
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PaginaInicial;
