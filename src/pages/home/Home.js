import React, { useEffect, useState } from 'react'
import styles from './Home.module.css'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Menu from '../menu/Menu.js'

const GameCard = ({ image, name, year, rating, id }) => {
    const getRatingColor = () => {
        if (rating >= 8) return '#1d8cf8'
        if (rating >= 5) return '#FFD700'
        return '#FF4C4C'
    }

    return (
        <Link to={"/jogo/" + id} className={styles.linkNoDecoration}>
            <div className={styles.card}>
                <div className={styles.imageContainer}>
                    <img src={image} alt={`${name} cover`} className={styles.gameImage} />
                </div>
                <div className={styles.infoContainer}>
                    <h3 className={styles.gameName}>{name}</h3>
                    <p className={styles.gameYear}>{year}</p>
                </div>
                <div className={styles.ratingContainer}>
                    <div className={styles.ratingBar}>
                        <div
                            className={styles.ratingFill}
                            style={{
                                width: `${(rating / 10) * 100}%`,
                                backgroundColor: getRatingColor(),
                            }}
                        ></div>
                    </div>
                    <span className={styles.ratingText}>{rating.toFixed(1)}</span>
                </div>
            </div>
        </Link>
    )
}

const Home = () => {
    const [games, setGames] = useState([])
    const location = useLocation()
    const navigate = useNavigate()
    const [initial, setInitial] = useState(new URLSearchParams(window.location.search).get('initial') || '')
    const [platform, setPlatform] = useState('')
    const [releaseYear, setReleaseYear] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedFilters, setSelectedFilters] = useState([])
    const [sortBy, setSortBy] = useState(new URLSearchParams(window.location.search).get('sort') || '')

    const itemsPerPage = 28

    const queryParams = new URLSearchParams(location.search)
    const searchQuery = queryParams.get('search') || ''
    const currentPage = parseInt(queryParams.get('page') || '1', 10)

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await axios.get("http://localhost:8080/jogos")
                setGames(response.data)
            } catch (error) {
                console.error("Erro ao buscar jogos:", error)
            }
        }

        fetchGames()
    }, [])

    const handleInitialClick = (char) => {
        setInitial(char)
    }

    const handleFilterSubmit = () => {
        setShowFilters(false)
        const newFilters = []
        if (platform) newFilters.push({ type: 'platform', value: platform })
        if (releaseYear) newFilters.push({ type: 'year', value: releaseYear })
        setSelectedFilters(newFilters)
    }

    const handleClearFilters = () => {
        setInitial('')
        setPlatform('')
        setReleaseYear('')
        setSelectedFilters([])
        setSortBy('')
        setShowFilters(false)
    }

    const handleFilterRemove = (filterType) => {
        setSelectedFilters(selectedFilters.filter((filter) => filter.type !== filterType))
        if (filterType === 'platform') setPlatform('')
        if (filterType === 'year') setReleaseYear('')
    }

    const handleSortChange = (e) => {
        const selectedSort = e.target.value
        setSortBy(selectedSort)
        queryParams.set('sort', selectedSort)
        queryParams.set('page', '1') 
        navigate(`/home?${queryParams.toString()}`)
    }

    const filteredGames = games.filter((game) => {
        const matchesInitial = game.name.startsWith(initial)
        const matchesPlatform =
            selectedFilters.some(filter => filter.type === 'platform' && game.platforms.toLowerCase().includes(filter.value.toLowerCase())) ||
            selectedFilters.filter(filter => filter.type !== 'platform').length === selectedFilters.length
        const matchesYear =
            selectedFilters.some(filter => filter.type === 'year' && game.year === filter.value) ||
            selectedFilters.filter(filter => filter.type !== 'year').length === selectedFilters.length
        const matchesSearch = searchQuery ? game.name.toLowerCase().includes(searchQuery.toLowerCase()) : true

        return matchesInitial && matchesPlatform && matchesYear && matchesSearch
    })

    const sortedGames = [...filteredGames].sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'date-asc') return a.year - b.year 
        if (sortBy === 'date-desc') return b.year - a.year
        return 0
    })

    const totalPages = Math.ceil(sortedGames.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const gamesToDisplay = sortedGames.slice(startIndex, endIndex)

    const handlePageChange = (pageNumber) => {
        queryParams.set('page', pageNumber)
        navigate(`/home?${queryParams.toString()}`)
    }

    return (
        <>
            <Menu />
            <div className={styles.container}>
                <div className={styles.filterSortContainer}>
                    <button className={styles.filterButton} onClick={() => setShowFilters(!showFilters)}>Filtros</button>
                    {initial || selectedFilters.length > 0 || sortBy ? (
                        <button className={styles.clearButton} onClick={handleClearFilters}>Limpar Filtros</button>
                    ) : null}

                    <select
                        className={styles.sortDropdown}
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="">Ordenar por</option>
                        <option value="rating">Nota</option>
                        <option value="date-asc">Data de Lançamento (Menor para Maior)</option>
                        <option value="date-desc">Data de Lançamento (Maior para Menor)</option>
                    </select>
                </div>

                {showFilters && (
                    <div className={styles.filterOptions}>
                        <div className={styles.filterInput}>
                            <label>Plataforma</label>
                            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                                <option value="">Selecione a plataforma</option>
                                <option value="PC">PC</option>
                                <option value="PlayStation">PlayStation</option>
                                <option value="Xbox">Xbox</option>
                            </select>
                        </div>
                        <div className={styles.filterInput}>
                            <label>Ano de Lançamento</label>
                            <input type="text" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} placeholder="Ex: 2020" />
                        </div>
                        <div className={styles.filterButtons}>
                            <button onClick={handleFilterSubmit}>Aplicar Filtros</button>
                        </div>
                    </div>
                )}

                <div className={styles.alphabetContainer}>
                    {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789").map((char, index) => (
                        <span
                            key={index}
                            className={`${styles.alphabetItem} ${char === initial ? styles.active : ''}`}
                            onClick={() => handleInitialClick(char)}
                        >
                            {char}
                        </span>
                    ))}
                </div>

                <div className={styles.selectedFilters}>
                    {selectedFilters.map((filter, index) => (
                        <span key={index} className={styles.selectedFilter}>
                            {filter.type === 'platform' ? `Plataforma: ${filter.value}` : ''}
                            {filter.type === 'year' ? `Ano: ${filter.value}` : ''}
                            <button className={styles.removeFilter} onClick={() => handleFilterRemove(filter.type)}>X</button>
                        </span>
                    ))}
                </div>

                <div className={styles.cardContainer}>
                    {gamesToDisplay.map((game, index) => (
                        <GameCard
                            key={index}
                            image={game.imageUrl}
                            name={game.name}
                            year={game.year}
                            rating={game.rating}
                            id={game.id}
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

export default Home
