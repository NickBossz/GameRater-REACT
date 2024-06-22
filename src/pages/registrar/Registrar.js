import styles from './Registrar.module.css';
import Menu from '../Menu';
import axios from 'axios';
import { useState } from 'react';
import { useUserType } from '../../UserTypeContext';

function Registrar() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const { setUserType } = useUserType();

    async function criarUsuario() {
        if (!checarInputs()) {
            return;
        }

        try {
            const dados = {
                usuario: usuario,
                senha: senha,
                cargo: "cliente"
            };

            const response = await axios.post("http://localhost:8086/criarUsuario", dados);

            if (response.data === true) {
                window.alert("Usuário criado com sucesso");
                handleLogin();
            } else {
                window.alert("Já existe um usuário com este nome!");
            }

        } catch (e) {
            console.log(e);
        }
    }

    function onChangeUsuario(event) {
        setUsuario(event.target.value);
    }

    function onChangeSenha(event) {
        setSenha(event.target.value);
    }

    function checarInputs() {
        const passwordInput = document.getElementById("password");
        const usernameInput = document.getElementById("username");

        if (passwordInput.value === "" || usernameInput.value === "") {
            window.alert("Preencha todos os campos");
            return false;
        }

        return true;
    }

    async function handleLogin() {
        try {
            const response = await axios.get("http://localhost:8086/usuarios/" + usuario);
            setUserType(response.data);
            window.history.pushState({}, '', '/');
            window.location.reload();
        } catch (e) {
            window.alert("Este usuário não existe!");
        }
    }

    return (
        <>
            <Menu />
            <div className={styles.Registrar}>
                <div className={styles["register-container"]}>
                    <h2>Registrar</h2>
                    <div>
                        <label htmlFor="username">Usuário</label>
                        <input type="text" id="username" name="username" onChange={onChangeUsuario} />
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="password" onChange={onChangeSenha} />
                        <button onClick={criarUsuario}>Registrar</button>
                    </div>
                    <div className={styles["login-link"]}>
                        <p>Já possui conta? <a href="/">Faça login aqui!</a></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Registrar;
