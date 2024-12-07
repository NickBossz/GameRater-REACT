import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import styles from './Perfil.module.css'
import { Buffer } from 'buffer'
import { useNotification } from '../NotificationManager.js'
import { useParams } from 'react-router-dom'
import { useUserType } from '../../UserTypeContext.js'
import Menu from '../menu/Menu.js'

function Perfil() {
    const { username } = useParams()
    const [role, setRole] = useState('')
    const [avaliacoes, setAvaliacoes] = useState([])
    const [analises, setAnalises] = useState([])
    const [mostrarAvaliacoes, setMostrarAvaliacoes] = useState(false)
    const [mostrarAnalises, setMostrarAnalises] = useState(false)
    const [profilePicture, setProfilePicture] = useState()
    const { userType } = useUserType()
    const notify = useNotification()

    const carregarAvaliacoes = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/avaliacoes/${username}`)
            setAvaliacoes(response.data.dados)
        } catch (error) {
            console.error('Erro ao carregar avaliações:', error)
        }

        try {
            const response = await axios.get(`http://localhost:8080/analisesDe/${username}`)
            setAnalises(response.data.dados)
        } catch (error) {
            console.error('Erro ao carregar análises:', error)
        }
    }, [username])

    const carregarAnalises = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/analisesDe/${username}`)
            setAnalises(response.data.dados)
        } catch (error) {
            console.error('Erro ao carregar análises:', error)
        }
    }, [username])

    const handleChangePicture = async (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()

            reader.onload = async (e) => {
                const base64String = e.target.result
                setProfilePicture(base64String)

                try {
                    const response = await axios.post('http://localhost:8080/uploadperfilimage', {
                        username: username,
                        base64String: base64String,
                    })

                    notify(response.data.mensagem, '#0080ff')
                } catch (error) {
                    notify('Erro ao enviar a nova foto de perfil.', '#cc0000')
                    console.error('Erro ao enviar a nova foto de perfil:', error)
                }
            }

            reader.onerror = () => {
                console.error('Erro ao ler o arquivo.')
                notify('Erro ao ler arquivo.', '#cc0000')
            }

            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        if (mostrarAvaliacoes) {
            carregarAvaliacoes()
        }
        if (mostrarAnalises) {
            carregarAnalises()
        }

        try {
            async function getPictureAndRoleSaved() {
                try {
                    const response = await axios.get(`http://localhost:8080/usuario/${username}`)

                    const { header_image, bytes_image } = response.data.dados
                    const { role } = response.data.dados

                    if (bytes_image && bytes_image.type === 'Buffer' && Array.isArray(bytes_image.data)) {
                        const buffer = Buffer.from(bytes_image.data)
                        const base64Image = buffer.toString('base64')

                        setProfilePicture(`${header_image},${base64Image}`)
                    } else {
                        console.error('Formato inválido de bytes_image:', bytes_image)
                    }

                    if (role) {
                        setRole(role)
                    }
                } catch (error) {
                    console.error('Erro ao buscar a imagem:', error)
                }
            }

            getPictureAndRoleSaved()
        } catch (e) {
            console.log('Erro ao tentar coletar foto salva: ' + e)
        }
    }, [mostrarAvaliacoes, mostrarAnalises, carregarAvaliacoes, carregarAnalises, username])

    return (
        <>
            <Menu />
            <div className={styles.perfilContainer}>
                <div className={styles.header}>
                    <div className={styles.profilePictureWrapper}>
                        <img className={styles.profilePicture} alt="Foto de perfil" src={profilePicture} />
                        {userType != null && userType.username === username && (
                            <>
                                <label htmlFor="changePicture" className={styles.changePictureButton}>
                                    Alterar Foto
                                </label>
                                <input
                                    id="changePicture"
                                    type="file"
                                    accept="image/*"
                                    className={styles.fileInput}
                                    onChange={handleChangePicture}
                                />
                            </>
                        )}
                    </div>
                    <div className={styles.userInfo}>
                        <h1 className={styles.username}>{username}</h1>
                        <p className={styles.userRole}>{role}</p>
                    </div>
                </div>

                <div className={styles.sectionMenu}>
                    <div
                        className={styles.section}
                        onClick={() => {
                            setMostrarAvaliacoes(!mostrarAvaliacoes)
                            setMostrarAnalises(false)
                        }}
                    >
                        <span>Avaliações</span>
                    </div>
                    <div
                        className={styles.section}
                        onClick={() => {
                            setMostrarAnalises(!mostrarAnalises)
                            setMostrarAvaliacoes(false)
                        }}
                    >
                        <span>Análises</span>
                    </div>
                </div>

                {mostrarAvaliacoes && (
                    <div className={styles.avaliacoesContainer}>
                        {avaliacoes.length > 0 ? (
                            avaliacoes.map((avaliacao) => (
                                <div key={avaliacao.id} className={styles.avaliacaoItem}>
                                    <img src={avaliacao.imageUrl} alt={avaliacao.name} className={styles.gameImage} />
                                    <div>
                                        <h3>{avaliacao.name}</h3>
                                        <p>Nota: {avaliacao.rating}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Nenhuma avaliação encontrada.</p>
                        )}
                    </div>
                )}

                {mostrarAnalises && (
                    <div className={styles.analisesContainer}>
                        {analises.length > 0 ? (
                            analises.map((analise) => (
                                <div key={analise.id} className={styles.analiseItem}>
                                    <img src={analise.imageUrl} alt={analise.name} className={styles.gameImage} />
                                    <div>
                                        <h3>{analise.name}</h3>
                                        <a
                                            href={`/analise/${analise.id}`}
                                            className={styles.verAnaliseButton}
                                        >
                                            Ver Análise
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Nenhuma análise encontrada.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default Perfil
