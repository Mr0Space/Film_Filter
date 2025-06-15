document.addEventListener('DOMContentLoaded', function() {
    // Загрузка фильмов из JSON файла
    let movies = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Загружаем данные о фильмах
    fetch('js/2.json')
        .then(response => response.json())
        .then(data => {
            movies = data.movies;
            renderMovies();
            renderFavorites();
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            // Если не удалось загрузить, используем дефолтные данные
            movies = [
                { id: 1, title: "Крестный отец", year: 1972, genre: "Драма", rating: 9.2, poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", plot: "Описание фильма", cast: ["Актер 1", "Актер 2"] },
                { id: 2, title: "Темный рыцарь", year: 2008, genre: "Боевик", rating: 9.0, poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg", plot: "Описание фильма", cast: ["Актер 1", "Актер 2"] },
                { id: 3, title: "Побег из Шоушенка", year: 1994, genre: "Драма", rating: 9.3, poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg", plot: "Описание фильма", cast: ["Актер 1", "Актер 2"] }
            ];
            renderMovies();
            renderFavorites();
        });

    // Функция для отображения фильмов
    function renderMovies(moviesToRender = movies) {
        const movieGrid = document.querySelector('.movie-g');
        movieGrid.innerHTML = '';

        moviesToRender.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-c';
            movieCard.dataset.id = movie.id;
            
            // Проверяем, есть ли фильм в избранном
            const isFavorite = favorites.some(fav => fav.id === movie.id);
            const favorite = favorites.find(fav => fav.id === movie.id);

            movieCard.innerHTML = `
                <div class="movie-p">
                    <img src="${movie.poster}" alt="${movie.title}" class="movie-poster-img">
                    <button class="fav-btn" title="${isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="movie-i">
                    <h3 class="movie-t">${movie.title}</h3>
                    <div class="movie-m">
                        <span>${movie.year}, ${movie.genre}</span>
                        <span class="movie-r">${movie.rating}</span>
                    </div>
                    ${isFavorite ? `
                    <div class="user-rating">
                        Ваша оценка: <span class="user-rating-value">${favorite?.userRating || 0}</span>/5
                    </div>` : ''}
                </div>
            `;

            // Добавляем обработчик клика для перехода на страницу фильма
            movieCard.addEventListener('click', function(e) {
                // Не переходим на страницу фильма, если кликнули на кнопку избранного
                if (!e.target.closest('.fav-btn')) {
                    window.location.href = `index_2.html?id=${movie.id}`;
                }
            });

            movieGrid.appendChild(movieCard);
        });

    }

    // Функция для создания звезд рейтинга
    function createStars(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += `<i class="fas fa-star" data-rating="${i}"></i>`;
            } else if (i - 0.5 <= rating) {
                starsHTML += `<i class="fas fa-star-half-alt" data-rating="${i - 0.5}"></i>`;
            } else {
                starsHTML += `<i class="far fa-star" data-rating="${i}"></i>`;
            }
        }
        return starsHTML;
    }

    // Функция рендера избранного списка с рейтингами
    function renderFavorites() {
        const favoritesList = document.querySelector('.fav-list');
        favoritesList.innerHTML = '';

        // Обновляем счетчик избранного
        document.querySelector('.badge').textContent = favorites.length;
    }
});