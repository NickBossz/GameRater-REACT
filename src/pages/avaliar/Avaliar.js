import styles from './Avaliar.module.css';
import Menu from '../Menu';
import axios from 'axios';
import { useState } from 'react';
import { useUserType } from '../../UserTypeContext';
const { v4: uuidv4 } = require('uuid');

function Avaliar() {
    const [avaliacao, setAvaliacao] = useState('');
    const [estrela, setEstrela] = useState(''); 
    const [nomeDoJogo, setNomeDoJogo] = useState(''); 
    const { userType } = useUserType();

    function onChangeNomeDoJogo(e) {
        setNomeDoJogo(e.target.value);
    }

    function onChangeEstrela(e) {
        setEstrela(e.target.value);
    }

    function onChangeAvaliacao(e) {
        setAvaliacao(e.target.value);
    }

    async function save() {
        try {
            const uniqueId = uuidv4();
            const dados = {
                usuarioQueEnviou: userType.usuario,
                nomeDoJogo: nomeDoJogo,
                avaliacao: avaliacao,
                estrela: estrela,
                uuid: uniqueId 
            };
            
            await axios.post("http://localhost:8086/avaliar", dados);
            window.alert("Avaliação enviada com sucesso!");
        } catch (e) {   
            window.alert('ERRO ' + e.response);
        }   
    }

    function clear() {
        setAvaliacao('');
        setNomeDoJogo('');
        setEstrela('');
    }

    function adicionarEstrelas(estrela) {
        const estrelas = [];
        for (let i = 0; i < estrela; i++) {
            estrelas.push(
                <img
                    key={i}
                    src={process.env.PUBLIC_URL + '/estrela.png'}
                    alt="Estrela"
                    className={styles.estrelaImg}
                />
            );
        }
        return (<div>{estrelas}</div>);
    }

    return (
        <>
            <Menu />
            <div className={styles.Avaliar}>
                <div id={styles.border}>
                    <form id={styles.formulario}>
                        <div>
                            <label htmlFor="nomeJogo">Nome do jogo</label>
                            <br />
                            <input type="text" id="nomeJogo" value={nomeDoJogo} onChange={onChangeNomeDoJogo} required />
                        </div>
                        <div>
                            <label htmlFor="avaliacao">Avaliação</label>
                            <br />
                            <textarea id="avaliacao" value={avaliacao} onChange={onChangeAvaliacao} required />
                        </div>
                        <div>
                            <span>Quantas estrelas você daria para o jogo?</span>
                            <br />
                            <label htmlFor="estrela1" className={styles.star}>
                                <input type="radio" id="estrela1" name="opcao" value="1" onChange={onChangeEstrela} required />
                                {adicionarEstrelas(1)}
                            </label>
                            <br/>
                            <label htmlFor="estrela2" className={styles.star}>
                                <input type="radio" id="estrela2" name="opcao" value="2" onChange={onChangeEstrela} required />
                                {adicionarEstrelas(2)}
                            </label>
                            <br/>
                            <label htmlFor="estrela3" className={styles.star}>
                                <input type="radio" id="estrela3" name="opcao" value="3" onChange={onChangeEstrela} required />
                                {adicionarEstrelas(3)}
                            </label>
                            <br/>
                            <label htmlFor="estrela4" className={styles.star}>
                                <input type="radio" id="estrela4" name="opcao" value="4" onChange={onChangeEstrela} required />
                                {adicionarEstrelas(4)}
                            </label>
                            <br/>
                            <label htmlFor="estrela5" className={styles.star}>
                                <input type="radio" id="estrela5" name="opcao" value="5" onChange={onChangeEstrela} required />
                                {adicionarEstrelas(5)}
                            </label>
                        </div>
                        <input type="button" value="Enviar" onClick={save} />
                        <br/>
                        <input type="reset" value="Limpar" onClick={clear} />
                    </form>
                </div>
            </div>
        </>
    );
}

export default Avaliar;
