import React, { useEffect, useState } from 'react'
import styles from './Analises.module.css'
import axios from 'axios'
import Menu from '../menu/Menu'
import { useNotification } from '../NotificationManager'
import { useLocation, useNavigate } from 'react-router-dom'

const ReviewCard = ({ id, user, review, rating, gameName, imageUrl }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/analise/${id}`)
    }

    const truncateReview = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    return (
        <div className={styles.card} onClick={handleClick}> {/* Adicionando o clique no card */}
            <img src={imageUrl} alt={gameName} className={styles.gameImage} />
            <div className={styles.cardContent}>
                <h3 className={styles.userName}>{user}</h3>
                <h4 className={styles.gameName}>{gameName}</h4>
                <p className={styles.reviewText}>{truncateReview(review, 150)}</p>
            </div>
        </div>
    )
}

const Analises = () => {
    const [reviews, setReviews] = useState([])
    const notify = useNotification()
    const location = useLocation()
    const navigate = useNavigate()

    const queryParams = new URLSearchParams(location.search)
    const searchQuery = queryParams.get('search') || ''
    const currentPage = parseInt(queryParams.get('page') || '1', 10)
    const itemsPerPage = 10 

    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await axios.get('http://localhost:8080/analises')
                setReviews(response.data.dados)
            } catch (error) {
                notify('Erro ao buscar análises.', '#cc0000')
                console.error('Erro ao buscar análises:', error)
            }
        }

        fetchReviews()
    }, [notify])

    const filteredReviews = reviews.filter((review) => {
        const matchesSearch = searchQuery ? review.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
        return matchesSearch
    })

    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const reviewsToDisplay = filteredReviews.slice(startIndex, endIndex)

    const handlePageChange = (pageNumber) => {
        navigate(`/analises?search=${searchQuery}&page=${pageNumber}`)
    }

    return (
        <>
            <Menu />
            <div className={styles.container}>
                <h1 className={styles.title}>Análises dos Usuários</h1>
                <div className={styles.cardContainer}>
                    {reviewsToDisplay.map((review) => (
                        <ReviewCard
                            key={review.id}
                            id={review.id}
                            user={review.username}
                            review={review.review}
                            rating={review.rating || 0}
                            gameName={review.name}
                            imageUrl={review.imageUrl}
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

export default Analises
