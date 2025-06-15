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

    // Функция для сохранения в localStorage
    function saveToLocalStorage() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Функция для удаления из избранного
    function removeFromFavorites(movieId) {
        favorites = favorites.filter(movie => movie.id !== movieId);
        saveToLocalStorage();
        renderFavorites();
        renderMovies();
    }

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

        // Обновляем обработчики для кнопок избранного
        updateFavButtons();
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

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<li>Пока нет избранных фильмов</li>';
        } else {
            favorites.forEach(movie => {
                const li = document.createElement('li');
                li.dataset.id = movie.id;

                li.innerHTML = `
                    <span>${movie.title} (${movie.year})</span>
                    <div class="movie-rating" data-movie-id="${movie.id}">
                        ${createStars(movie.userRating || 0)}
                        <span class="rating-value">${movie.userRating?.toFixed(1) || 0}/5</span>
                    </div>
                    <button class="remove-btn"><i class="fas fa-times"></i></button>
                `;

                // Обработка клика по звездам
                const ratingContainer = li.querySelector('.movie-rating');
                ratingContainer.addEventListener('click', function(e) {
                    if (e.target.classList.contains('fa-star') || 
                        e.target.classList.contains('fa-star-half-alt')) {
                        const star = e.target;
                        const rating = parseFloat(star.dataset.rating);
                        
                        // Обновляем рейтинг
                        const movieId = parseInt(this.dataset.movieId);
                        const favMovie = favorites.find(m => m.id === movieId);
                        if (favMovie) {
                            favMovie.userRating = rating;
                            saveToLocalStorage();
                            
                            // Обновляем отображение
                            this.innerHTML = createStars(rating) + 
                                `<span class="rating-value">${rating.toFixed(1)}/5</span>`;
                            
                            // Обновляем рейтинг в основной сетке
                            updateMovieRating(movieId, rating);
                        }
                    }
                });

                // Кнопка удаления
                li.querySelector('.remove-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeFromFavorites(movie.id);
                });

                favoritesList.appendChild(li);
            });
        }

        // Обновляем счетчик избранного
        document.querySelector('.badge').textContent = favorites.length;
    }

    // Обновляет рейтинг в основной сетке фильмов
    function updateMovieRating(movieId, rating) {
        document.querySelectorAll('.movie-c').forEach(card => {
            if (parseInt(card.dataset.id) === movieId) {
                const ratingElement = card.querySelector('.user-rating-value');
                if (ratingElement) {
                    ratingElement.textContent = rating.toFixed(1);
                }
            }
        });
    }

    // Обновляет обработчики для кнопок избранного
    function updateFavButtons() {
        document.querySelectorAll('.fav-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.movie-c');
                const movieId = parseInt(card.dataset.id);
                const movie = movies.find(m => m.id === movieId);
                
                if (movie) {
                    const index = favorites.findIndex(m => m.id === movie.id);
                    
                    if (index === -1) {
                        // Добавляем в избранное
                        favorites.push({ ...movie, userRating: 0 });
                    } else {
                        // Удаляем из избранного
                        favorites.splice(index, 1);
                    }
                    
                    saveToLocalStorage();
                    renderMovies();
                    renderFavorites();
                }
            });
        });
    }

    // Обработчики для фильтров
    function setupFilters() {
        const searchInput = document.querySelector('.sea-it');
        const genreFilter = document.querySelector('[data-filter="genre"]');
        const yearFilter = document.querySelector('[data-filter="year"]');
        const ratingFilter = document.querySelector('[data-filter="rating"]');
        
        function applyFilters() {
            const searchTerm = searchInput.value.toLowerCase();
            const genreValue = genreFilter.value;
            const yearValue = yearFilter.value;
            const ratingValue = ratingFilter.value;
            
            let filteredMovies = movies;
            
            // Применяем поиск
            if (searchTerm) {
                filteredMovies = filteredMovies.filter(movie => 
                    movie.title.toLowerCase().includes(searchTerm) ||
                    movie.genre.toLowerCase().includes(searchTerm) ||
                    (movie.director && movie.director.toLowerCase().includes(searchTerm)));
            }
            
            // Применяем фильтр по жанру
            if (genreValue !== 'Все жанры') {
                filteredMovies = filteredMovies.filter(movie => 
                    movie.genre.includes(genreValue));
            }
            
            // Применяем фильтр по году
            if (yearValue !== 'Все годы') {
                const years = yearValue.split('-').map(Number);
                if (years.length === 2) {
                    filteredMovies = filteredMovies.filter(movie => 
                        movie.year >= years[0] && movie.year <= years[1]);
                }
            }
            
            // Применяем фильтр по рейтингу
            if (ratingValue !== 'Любой') {
                if (ratingValue === '8+') {
                    filteredMovies = filteredMovies.filter(movie => movie.rating >= 8);
                } else if (ratingValue === '5-8') {
                    filteredMovies = filteredMovies.filter(movie => movie.rating >= 5 && movie.rating < 8);
                } else if (ratingValue === '0-5') {
                    filteredMovies = filteredMovies.filter(movie => movie.rating < 5);
                }
            }
            
            renderMovies(filteredMovies);
        }
        
        // Назначаем обработчики событий
        searchInput.addEventListener('input', applyFilters);
        genreFilter.addEventListener('change', applyFilters);
        yearFilter.addEventListener('change', applyFilters);
        ratingFilter.addEventListener('change', applyFilters);
    }

    // Инициализация фильтров
    setupFilters();
});