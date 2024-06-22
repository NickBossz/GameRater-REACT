import { useEffect } from 'react';
import { useUserType } from '../UserTypeContext';
import './Menu.module.css'
import { Link } from 'react-router-dom';

function Menu(){
    const { userType, setUserType } = useUserType();
    
    useEffect(() => {

        if (userType != null) {
            const loginButton = document.getElementById("loginButtonMenu")
            const denunciasButtonMenu = document.getElementById("denunciasButtonMenu")

            loginButton.innerHTML = "Sair"
            
            
            if (userType.cargo !== "funcionario") {
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

    }, [userType]);
    
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