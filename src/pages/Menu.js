import { useEffect } from 'react';
import { useUserType } from '../UserTypeContext';
import './Menu.module.css'
import { Link } from 'react-router-dom';
import axios from 'axios';

function Menu(){
    const { userType, setUserType } = useUserType();
    
    useEffect(() => {

        if (userType != null) {

            async function checkIfUserStillExists(){
                try{
                    const response = await axios.get("http://localhost:8080/usuarios/" + userType.usuario)
                    
                    if (response.data === '') {
                        return false;
                    }
                    return true;
                } catch(e){
                    return false;
                }
        
            }

            async function handleCheckUser() {
                const userExists = await checkIfUserStillExists();
        
                console.log(userExists);
        
                if (!userExists) {
                    console.log("tirou");
                    setUserType(null);
                    window.history.pushState({}, '', '/');
                    window.location.reload();
                }
            }

            handleCheckUser()
            const loginButton = document.getElementById("loginButtonMenu")
            const denunciasButtonMenu = document.getElementById("denunciasButtonMenu")

            loginButton.innerHTML = "Sair"
            
            
            if (userType.cargo !== "FUNCIONARIO") {
                if (denunciasButtonMenu) {
                    denunciasButtonMenu.remove()
                }
            }
            
        } else {
        

            const perfilButtonMenu = document.getElementById("perfilButtonMenu")
            const AvalieAquiButtonMenu = document.getElementById("avalieAquiButtonMenu")
            const denunciasButtonMenu = document.getElementById("denunciasButtonMenu")

            if (perfilButtonMenu) {
                perfilButtonMenu.remove()
            }

            if (AvalieAquiButtonMenu) {
                AvalieAquiButtonMenu.remove()
            }

            if (denunciasButtonMenu) {
                denunciasButtonMenu.remove()
            }
        }

    }, [userType, setUserType]);
    


    


    function onClickLoginButton(){

        if (userType != null) {
            setUserType(null);
            window.history.pushState({}, '', '/');
            window.location.reload();
        }
    }

   

    return (<>
        <nav>
            <button>
                <Link to={'/'}>Página Inicial</Link>
            </button>
            <button id="perfilButtonMenu">
                <Link to={'/perfil'}>Perfil</Link>
            </button>
            <button id="avalieAquiButtonMenu">
                <Link  to={'/avaliar'}>Avalie aqui!</Link>
            </button>
            <button>
                <Link to={'/avaliacoes'}>Avaliações</Link>
            </button>
            <button id="denunciasButtonMenu">
                <Link to={'/denuncias'}>Denuncias</Link>
            </button>
            <button id="loginButtonMenu" onClick={onClickLoginButton}>
                <Link to={'/login'}>Login</Link>
            </button>
            
        </nav>
    </>);

}

export default Menu;