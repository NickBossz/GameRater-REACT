import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Menu.module.css'
import { Link } from 'react-router-dom'
import Login from '../login/Login.js'
import Registrar from '../registrar/Registrar.js'
import { useUserType } from '../../UserTypeContext.js'

const Menu = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isRegisterMode, setIsRegisterMode] = useState(false)
    const { userType, setUserType } = useUserType()
    const [searchTerm, setSearchTerm] = useState('') 
    const history = useNavigate()

    const handleLoginClick = () => {
        setIsRegisterMode(false)
        setIsModalOpen(true)
    }

    const handleRegisterClick = () => {
        setIsRegisterMode(true)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const loggout = () => {
        setUserType(null)
        history('/') 
        window.location.reload()
    }

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        history(`${window.location.pathname}?search=${value}`)
    }

    return (
        <div className={styles.menuContainer}>
            <div className={styles.logoSection}>
                <img alt="Logo" className={styles.logo} src={process.env.PUBLIC_URL + '/Logo-no-bg.png'} />
                <span className={styles.title}>GAME REVIEW</span>
            </div>
            <div className={styles.language}>PT</div>
            <nav className={styles.navLinks}>
                <Link to={'/home'} className={styles.navLink}>HOME</Link>
                <Link to={'/analises'} className={styles.navLink}>ANÁLISES</Link>
                <Link to={'/comunidade'} className={styles.navLink}>COMUNIDADE</Link>
                {userType !== null && (
                    <Link to={'/perfil/' + userType.username} className={styles.navLink}>PERFIL</Link>
                )}
            </nav>

            {(window.location.pathname === '/home' || window.location.pathname === "/analises") && (
                <div className={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="PROCURAR JOGO"
                        className={styles.searchInput}
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                    />
                </div>
            )}

            {userType !== null ? (
                <button className={styles.loginButton} onClick={loggout}>Sair</button>
            ) : (
                <button className={styles.loginButton} onClick={handleLoginClick}>Entrar</button>
            )}

            {isModalOpen && (
                isRegisterMode ? 
                    <Registrar closeModal={closeModal} onLoginClick={handleLoginClick} /> :
                    <Login closeModal={closeModal} onRegisterClick={handleRegisterClick} />
            )}
        </div>
    )
}

export default Menu
