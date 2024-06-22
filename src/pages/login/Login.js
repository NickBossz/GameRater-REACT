import styles from './Login.module.css';
import Menu from '../Menu';
import { useUserType } from '../../UserTypeContext';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const { setUserType } = useUserType();

    async function handleLogin() {
        if (!checarInputs()) {
            return;
        }

        try {
            const response = await axios.get("http://localhost:8086/usuarios/" + usuario);
            if (response.data.senha === senha) {
                setUserType(response.data);
                window.history.pushState({}, '', '/');
                window.location.reload();
            } else {
                window.alert("A senha está incorreta!")
            }
        } catch (e) {
            window.alert("Este usuário não existe!");
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

    return (
        <>
            <Menu />
            <div className={styles.Login}>
                <div className={styles["login-container"]}>
                    <h2>Login</h2>
                    <div>
                        <label htmlFor="username">Usuário</label>
                        <input type="text" id="username" name="username" onChange={onChangeUsuario} />
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="password" onChange={onChangeSenha} />
                        <button onClick={handleLogin}>Entrar</button>
                    </div>
                    <div className={styles["register-link"]}>
                        <p>Não tem uma conta? <Link to="/registrar">Registre-se aqui</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
