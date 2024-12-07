import React, { useEffect, useState } from 'react'
import styles from './Jogo.module.css'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useUserType } from '../../UserTypeContext'
import { useNotification } from '../NotificationManager'
import Menu from '../menu/Menu'

const Jogo = () => {
    const [dadosJogo, setDadosJogo] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [ratings, setRatings] = useState({
        ambientacao: 5,
        campanha: 5,
        jogabilidade: 5,
        audio: 5,
        diversao: 5
    })
    const [ReviewText, setReviewText] = useState("") 
    const { userType } = useUserType()
    const { id } = useParams()
    const notify = useNotification()

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await axios.get("http://localhost:8080/jogo/" + id)
                setDadosJogo(response.data)
            } catch (error) {
                console.error("Erro ao buscar jogos:", error)
            }
        }

        fetchGames()
    }, [id])

    if (!dadosJogo) return <p>Carregando...</p>

    const coletarRatingColor = (rating) => {
        if (rating >= 8) return '#4caf50'
        if (rating >= 5) return '#ffeb3b'
        return '#f44336'
    }

    const toggleModal = () => {
        if (userType === null) {
            notify("Você precisa criar uma conta ou logar em uma primeiro!", "#cc0000")
            return
        }
        setShowModal(!showModal)
    }

    const toggleReviewModal = () => {
        if (userType === null) {
            notify("Você precisa criar uma conta ou logar em uma primeiro!", "#cc0000")
            return
        }
        setShowReviewModal(!showReviewModal)
    }

    const handleRatingChange = (criteria, value) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [criteria]: value
        }))
    }

    const submitRating = async () => {
        try {
            const media_rating = (ratings.ambientacao + ratings.audio + ratings.campanha + ratings.diversao + ratings.jogabilidade) / 5

            const response = await axios.post("http://localhost:8080/avaliar/" + id, {
                game_id: id,
                username: userType.username,
                rating: media_rating
            })

            notify(response.data.mensagem, "#0080ff")
            setShowModal(false)
        } catch (error) {
            notify("Erro ao avaliar jogo.", "#cc0000")
            console.log("Erro ao avaliar jogo: " + error)
        }
    }

    const handleSubmitReview = async () => {
        try {
            const response = await axios.post("http://localhost:8080/criarAnalise", {
                game_id: id,
                username: userType.username,
                review: ReviewText,
            })
            notify(response.data.mensagem, "#0080ff")
            setShowReviewModal(false)
            setReviewText("")
        } catch (error) {
            notify("Erro ao enviar análise.", "#cc0000")
            console.log("Erro ao enviar análise: " + error)
        }
    }

    return (
        <>
            <Menu/>
            <div className={styles.container}>

                
                <div className={styles.imageWrapper}>
                    <img src={dadosJogo.imageUrl} alt={dadosJogo.name} className={styles.image} />
                    <div className={styles.overlay}></div>
                </div>

                <div className={styles.content}>
                    <h1 className={styles.title}>{dadosJogo.name}</h1>
                    <div className={styles.tags}>
                        <span className={styles.tag}>{dadosJogo.year}</span>
                        <span className={styles.tag}>{dadosJogo.genre}</span>
                        <span className={styles.tag}>{dadosJogo.platforms}</span>
                    </div>
                    <div className={styles.ratingContainer}>
                        <span className={styles.ratingLabel}>Nota da Crítica</span>
                        <div className={styles.ratingBar}>
                            <div
                                className={styles.ratingFill}
                                style={{
                                    width: `${dadosJogo.rating * 10}%`,
                                    backgroundColor: coletarRatingColor(dadosJogo.rating),
                                }}
                            ></div>
                        </div>
                        <span className={styles.ratingValue}>{dadosJogo.rating.toFixed(1)}</span>
                    </div>
                    <button className={styles.rateButton} onClick={toggleModal}>Avaliar Jogo</button>
                    <button className={styles.rateButton} onClick={toggleReviewModal}>Criar Análise</button>
                </div>

                {showModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>Avalie o Jogo</h2>
                            {["ambientacao", "campanha", "jogabilidade", "audio", "diversao"].map((criteria) => (
                                <div key={criteria} className={styles.sliderContainer}>
                                    <label>{criteria.charAt(0).toUpperCase() + criteria.slice(1)}</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={ratings[criteria]}
                                        onChange={(e) => handleRatingChange(criteria, parseInt(e.target.value))}
                                    />
                                    <span>{ratings[criteria]}</span>
                                </div>
                            ))}
                            <button className={styles.submitButton} onClick={submitRating}>Enviar Avaliação</button>
                            <button className={styles.closeButton} onClick={toggleModal}>Fechar</button>
                        </div>
                    </div>
                )}

                {showReviewModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>Escreva sua Análise</h2>
                            <textarea
                                value={ReviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className={styles.textArea}
                                placeholder="Escreva aqui sua análise sobre o jogo..."
                            ></textarea>
                            <button className={styles.submitButton} onClick={handleSubmitReview}>Enviar Análise</button>
                            <button className={styles.closeButton} onClick={toggleReviewModal}>Fechar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Jogo
