document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = parseInt(urlParams.get('id')) || 1;
    
    try {
        const movie = await loadMovieData(movieId);
        displayMovieData(movie);
        setupFavoriteButton(movie);
    } catch (error) {
        console.error('Ошибка:', error);
        displayError();
    }
});

async function loadMovieData(movieId) {
    const response = await fetch('js/2.json');
    if (!response.ok) throw new Error('Не удалось загрузить данные');
    
    const data = await response.json();
    const movie = data.movies.find(m => m.id === movieId);
    if (!movie) throw new Error('Фильм не найден');
    return movie;
}

function displayMovieData(movie) {
    document.title = `Кинотека - ${movie.title}`;
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-year').textContent = movie.year;
    document.getElementById('movie-genre').textContent = movie.genre;
    document.getElementById('movie-director').textContent = movie.director || 'Не указан';
    document.getElementById('movie-rating').textContent = movie.rating.toFixed(1);
    document.getElementById('movie-plot').textContent = movie.plot;
    
    const posterImg = document.getElementById('movie-poster-img');
    posterImg.src = movie.poster;
    posterImg.alt = `Постер фильма "${movie.title}"`;
    
    const castList = document.getElementById('movie-cast-list');
    castList.innerHTML = movie.cast.map(actor => `<li>${actor}</li>`).join('');
}

function setupFavoriteButton(movie) {
    const favButton = document.getElementById('add-to-favorites-btn');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    
    updateButtonState(favButton, isFavorite);
    
    favButton.addEventListener('click', () => {
        const index = favorites.findIndex(fav => fav.id === movie.id);
        
        if (index === -1) {
            favorites.push({
                id: movie.id,
                title: movie.title,
                year: movie.year,
                genre: movie.genre,
                poster: movie.poster,
                rating: movie.rating
            });
        } else {
            favorites.splice(index, 1);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateButtonState(favButton, !isFavorite);
    });
}

function updateButtonState(button, isActive) {
    button.innerHTML = isActive 
        ? '<i class="fas fa-heart"></i> В избранном' 
        : '<i class="far fa-heart"></i> Добавить в избранное';
    button.classList.toggle('active', isActive);
}

function displayError() {
    const container = document.querySelector('.movie-container');
    container.innerHTML = `
        <div class="error-message">
            <h2>Произошла ошибка</h2>
            <p>Не удалось загрузить данные о фильме. Попробуйте позже.</p>
            <a href="index.html" class="btn btn-p">Вернуться в каталог</a>
        </div>
    `;
}