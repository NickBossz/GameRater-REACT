import React, { useEffect, useState } from 'react'
import styles from './Comunidade.module.css'
import axios from 'axios'
import Menu from '../menu/Menu'
import { useNavigate, useLocation } from 'react-router-dom'
import { Buffer } from 'buffer'

const UserCard = ({ username, profilePicture }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/perfil/${username}`)
    }

    return (
        <div className={styles.card} onClick={handleClick}>
            <img src={profilePicture} alt={username} className={styles.profilePicture} />
            <h3 className={styles.userName}>{username}</h3>
        </div>
    )
}

const Comunidade = () => {
    const [users, setUsers] = useState([])
    const location = useLocation()
    const navigate = useNavigate()

    const queryParams = new URLSearchParams(location.search)
    const currentPage = parseInt(queryParams.get('page') || '1', 10)
    const itemsPerPage = 8

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get('http://localhost:8080/usuarios')

                const usuarios = await Promise.all(
                    response.data.dados.map(async usuario => {
                        const { header_image, bytes_image } = usuario
                        let profilePicture

                        if (bytes_image && bytes_image.type === 'Buffer' && Array.isArray(bytes_image.data)) {
                            const buffer = Buffer.from(bytes_image.data)
                            const base64Image = buffer.toString('base64')

                            profilePicture = `${header_image},${base64Image}`
                        } else {
                            console.error('Formato inválido de bytes_image:', bytes_image)
                        }

                        return {
                            username: usuario.username,
                            imageUrl: profilePicture
                        }
                    })
                )

                setUsers(usuarios)
            } catch (error) {
                console.error('Erro ao buscar usuários:', error)
            }
        }

        fetchUsers()
    }, [])

    const totalPages = Math.ceil(users.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const usersToDisplay = users.slice(startIndex, endIndex)

    const handlePageChange = (pageNumber) => {
        navigate(`/comunidade?page=${pageNumber}`)
    }

    return (
        <>
            <Menu />
            <div className={styles.container}>
                <h1 className={styles.title}>Comunidade</h1>
                <div className={styles.cardContainer}>
                    {usersToDisplay.map((user, index) => (
                        <UserCard
                            key={index}
                            username={user.username}
                            profilePicture={user.imageUrl}
                        />
                    ))}
                </div>

                <div className={styles.pagination}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        Anterior
                    </button>
                    <span>{`Página ${currentPage} de ${totalPages}`}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </>
    )
}

export default Comunidade
