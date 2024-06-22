import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Avaliacao.module.css';
import Menu from '../Menu';
import { useUserType } from '../../UserTypeContext';
import axios from 'axios';
const { v4: uuidv4 } = require('uuid');

function Avaliacao() {
  let { uuid } = useParams();
  const [nomeDoJogo, setNomeDoJogo] = useState('');
  const [avaliacao, setAvaliacao] = useState('');
  const [estrelas, setEstrelas] = useState('');
  const [usuarioQueEnviou, setUsuarioQueEnviou] = useState('');
  const [motivoDenuncia, setMotivoDenuncia] = useState('');
  const [mostrarDenuncia, setMostrarDenuncia] = useState(false);
  const { userType } = useUserType();

  useEffect(() => {


    async function fetchAvaliacao(){
      try {
        const response = await axios.get("http://localhost:8086/avaliacao/" + uuid)
    
        setNomeDoJogo(response.data[0].nomeDoJogo);
        setAvaliacao(response.data[0].avaliacao);
        setEstrelas(response.data[0].estrela);
        setUsuarioQueEnviou(response.data[0].usuarioQueEnviou);
      } catch (e) {
          window.alert("ERRO")
      }
    }

    fetchAvaliacao()

    if (userType == null) {
      const denunciarToogleButton = document.getElementById("botaoToggleDenuncia")
      
      if (denunciarToogleButton) {
        denunciarToogleButton.remove()
      }
    }


  }, [uuid, userType]);

  function adicionarEstrelas(estrela) {
    const estrelas = [];
    for (let i = 0; i < estrela; i++) {
      estrelas.push(
        <img
          key={i}
          src={process.env.PUBLIC_URL + '/estrela.png'}
          alt="Estrela"
          className={styles.estrela}
        />
      );
    }
    return (<div>{estrelas}</div>);
  }

  function handleDenunciaSubmit() {
    console.log('Denúncia enviada:', motivoDenuncia);

    const uuidDenuncia = uuidv4();


    try {

      const dados = {
          feitaPor: userType.usuario,
          motivoDenuncia: motivoDenuncia,
          avaliacao: uuid,
          uuid: uuidDenuncia
      }

        const response = axios.post("http://localhost:8086/denunciar", dados)
        console.log(response.data)
        window.alert("Denuncia enviada com sucesso!")
    } catch {
        window.alert("ERRO")
    }



  };

  function toggleDenuncia() {
    setMostrarDenuncia(!mostrarDenuncia);
  };

  return (
    <>
      <Menu />
      <div className={styles.avaliacaoContainer}>
        <div className={styles.gameInfo}>
          <h1 className={styles.gameName}>
            {nomeDoJogo} {adicionarEstrelas(estrelas)}
          </h1>
          <div className={styles.reviewInfo}>
            <p>Quem fez a avaliação: <span className={styles.reviewer}>{usuarioQueEnviou}</span></p>
            <div className={styles.review}>
              <p>{avaliacao}</p>
            </div>
          </div>
          <button onClick={toggleDenuncia} className={styles.botaoMostrarDenuncia} id="botaoToggleDenuncia">
            {mostrarDenuncia ? 'Esconder Denúncia' : 'Denunciar'}
          </button>
          {mostrarDenuncia && (
            <div className={styles.denunciaContainer}>
              <h2>Denunciar Avaliação</h2>
              <textarea
                className={styles.motivoDenuncia}
                value={motivoDenuncia}
                onChange={(e) => setMotivoDenuncia(e.target.value)}
                placeholder="Motivo da denúncia"
              />
              <button onClick={handleDenunciaSubmit} className={styles.botaoDenuncia}>Enviar Denúncia</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Avaliacao;
