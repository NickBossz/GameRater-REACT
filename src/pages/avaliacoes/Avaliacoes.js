import React, { useState, useEffect } from 'react';
import styles from './Avaliacoes.module.css';
import Menu from '../Menu';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Avaliacoes() {
    const [listaDeAvaliacoes, setListaDeAvaliacoes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchAvaliacoes() {
            try {
                const response = await axios.get("http://localhost:8086/avaliacoes");
                setListaDeAvaliacoes(response.data);
            } catch (e) {
                window.alert("ERRO");
            }
        }

        fetchAvaliacoes();
    }, []);

    function adicionarEstrelas(jogo){
        const estrelas = [];
        for (let i = 0; i < jogo.estrela; i++) {
            estrelas.push(
                <img
                    key={i}
                    src={process.env.PUBLIC_URL + '/estrela.png'}
                    alt="Estrela"
                    className={styles.estrela}
                />
            );
        }
        return(<div>{estrelas}</div>)
    }

    const filteredAvaliacoes = listaDeAvaliacoes.filter(jogo =>
        jogo.nomeDoJogo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Menu />
            <div className={styles.container}>
                <h1 className={styles.titulo}>Tabela de Avaliações</h1>
                <input
                    type="text"
                    placeholder="Pesquisar avaliações por nome do jogo"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={styles.searchBar}
                />
                <div className={styles.avaliacaoContainer}>
                    {filteredAvaliacoes.map((jogo, index) => (
                        <div className={styles.avaliacaoCard} key={index}>
                            <h2 className={styles.nomeJogo}>{jogo.nomeDoJogo}</h2>
                            <p className={styles.estrela}>{adicionarEstrelas(jogo)}</p>
                            <p className={styles.avaliacao}>{"Feito por: " + jogo.usuarioQueEnviou}</p>
                            <Link to={"/avaliacao/" + jogo.uuid}>
                                <button className={styles.entrarBtn}>Entrar</button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Avaliacoes;
