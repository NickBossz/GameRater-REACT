import React, { useEffect, useState } from 'react';
import styles from './Denuncia.module.css';
import Menu from '../Menu';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Denuncia() {
    let { uuid } = useParams();

    const [mostrarConfirmacaoDeEncerrarDenuncia, setMostrarConfirmacaoDeEncerrarDenuncia] = useState(false);
    const [mostrarConfirmacaoDeEncerrarConta, setMostrarConfirmacaoDeEncerrarConta] = useState(false);
    const [mostrarConfirmacaoDeEncerrarAvaliacao, setMostrarConfirmacaoDeEncerrarAvaliacao] = useState(false);

    const [avaliacao, setAvaliacao] = useState('');
    const [feitaPor, setFeitaPor] = useState('');
    const [motivo, setMotivo] = useState('');

    useEffect(() => {
        async function fetchDenuncia(){
            try {
                const response = await axios.get("http://localhost:8086/denuncia/" + uuid)
            
                setAvaliacao(response.data[0].avaliacao)
                setFeitaPor(response.data[0].feitaPor)
                setMotivo(response.data[0].motivoDenuncia)
            } catch (e) {
                window.alert("ERRO")
            }
        }

        fetchDenuncia()
      }, [uuid]);

    function handleEncerrarDenuncia() {
        setMostrarConfirmacaoDeEncerrarDenuncia(true);
    };

    function handleEncerrarAvaliacao() {
        setMostrarConfirmacaoDeEncerrarAvaliacao(true);
    };


    function handleEncerrarConta () {
        setMostrarConfirmacaoDeEncerrarConta(true);
    };

    function confirmEncerrarDenuncia(){
        setMostrarConfirmacaoDeEncerrarDenuncia(false);

        try{
            axios.delete("http://localhost:8086/excluirDenuncia/" + uuid)
        } catch (e){
            window.alert("ERRO")
        }
        window.history.pushState({}, '', '/denuncias');
        window.location.reload();
    };

    function confirmEncerrarAvaliacao(){
        try{
            axios.delete("http://localhost:8086/excluirAvaliacao/" + avaliacao)
        } catch (e){
            window.alert("ERRO")
        }
        window.history.pushState({}, '', '/denuncias');
        window.location.reload();

        confirmEncerrarDenuncia()
    }

    function confirmEncerrarConta() {

        setMostrarConfirmacaoDeEncerrarConta(false);

        try{
            axios.delete("http://localhost:8086/excluirUsuario/" + feitaPor)
        } catch (e){
            window.alert("Este usuário não existe!")
        }

        confirmEncerrarDenuncia()
    };

    function handleAcessarAvaliacao() {
        window.open("/avaliacao/" + avaliacao)
    };

    return ( <>
        <Menu />

        <div className={styles.denunciaPage}>
            <div className={styles.background}>
                <div className={styles.denunciaContent}>
                    <h1>Denúncia</h1>
                    <p><strong>Pessoa que fez a denúncia:</strong> {feitaPor}</p>
                    <p><strong>Motivo da denúncia:</strong> {motivo}</p>
                    <div className={styles.buttons}>
                        <button className={styles.button} onClick={handleEncerrarDenuncia}>Encerrar denúncia</button>
                        <button className={styles.button} onClick={handleAcessarAvaliacao}>Acessar avaliação</button>
                        <button className={styles.button} onClick={handleEncerrarConta}>Encerrar Conta do Usuário denunciado</button>
                        <button className={styles.button} onClick={handleEncerrarAvaliacao}>Encerrar avaliação</button>
                    </div>
                    {mostrarConfirmacaoDeEncerrarDenuncia && (
                        <div className={styles.confirmBox}>
                            <p>Tem certeza que deseja encerrar a denúncia?</p>
                            <button className={styles.button} onClick={confirmEncerrarDenuncia}>Confirmar</button>
                            <button className={styles.button} onClick={() => setMostrarConfirmacaoDeEncerrarDenuncia(false)}>Cancelar</button>
                        </div>
                    )}
                    {mostrarConfirmacaoDeEncerrarConta && (
                        <div className={styles.confirmBox}>
                            <p>Tem certeza que deseja encerrar a conta do usuário?</p>
                            <button className={styles.button} onClick={confirmEncerrarConta}>Confirmar</button>
                            <button className={styles.button} onClick={() => setMostrarConfirmacaoDeEncerrarConta(false)}>Cancelar</button>
                        </div>
                    )}
                    {mostrarConfirmacaoDeEncerrarAvaliacao && (
                        <div className={styles.confirmBox}>
                            <p>Tem certeza que deseja encerrar esta avaliação?</p>
                            <button className={styles.button} onClick={confirmEncerrarAvaliacao}>Confirmar</button>
                            <button className={styles.button} onClick={() => setMostrarConfirmacaoDeEncerrarAvaliacao(false)}>Cancelar</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
    );
}

export default Denuncia;
