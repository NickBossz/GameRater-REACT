import React, { useEffect, useState } from 'react'
import styles from './Analise.module.css'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Menu from '../menu/Menu'

const Analise = () => {
    const [dadosAnalise, setDadosAnalise] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        async function fetchAnalise() {
            try {
                const response = await axios.get("http://localhost:8080/analise/" + id)
                setDadosAnalise(response.data.dados)
            } catch (error) {
                console.error("Erro ao buscar análise:", error)
            }
        }

        fetchAnalise()
    }, [id])

    if (!dadosAnalise) return <p>Carregando...</p>

    return (
        <>
            <Menu />
            <div className={styles.container}>
                <div className={styles.imageWrapper}>
                    <img src={dadosAnalise.imageUrl} alt={dadosAnalise.gameName} className={styles.image} />
                    <div className={styles.overlay}></div>
                </div>
                <div className={styles.content}>
                    <h1 className={styles.title}>{dadosAnalise.gameName}</h1>
                    <div className={styles.tags}>
                        <span className={styles.tag}> {dadosAnalise.name} </span>
                    </div>
                    <a href={`/perfil/${dadosAnalise.username}`} target="_blank" rel="noopener noreferrer">
                        <button className={styles.rateButton}>Exibir perfil</button>
                    </a>
                    <h2 className={styles.reviewTitle}>Análise de {dadosAnalise.username}</h2>
                    <p className={styles.reviewText}>{dadosAnalise.review}</p>
                </div>
            </div>
        </>
    )
}


export default Analise
