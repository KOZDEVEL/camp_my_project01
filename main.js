const api_key = '8206b490bb080c4a5d3dfd083e2b914d';
const apiUrl = 'https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1&api_key=' + api_key;

// 함수를 사용하여 영화 카드 생성
function createMovieCard(movie) {
  const card = document.createElement('div');
  card.classList.add('movie-card');
  card.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
    <h2>${movie.title}</h2>
    <p>${movie.overview}</p>
    <p>Rating: ${movie.vote_average}</p>`;

  card.setAttribute('data-movie-id', movie.id);

  card.addEventListener('click', () => {
    const movieId = card.getAttribute('data-movie-id');
    alert(`Clicked on movie with ID: ${movieId}`);
  });

  return card;
}

// API로 영화 목록을 가져와서 보여주는 함수
const fetchMovies = () => {
  return fetch(apiUrl, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const movieContainer = document.getElementById('movie-card-container');

      data.results.forEach((movie) => {
        const card = createMovieCard(movie);
        movieContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

// 검색 버튼 클릭 이벤트
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

searchButton.addEventListener('click', async () => {
  const searchQuery = searchInput.value;
  if (searchQuery) {
    const movieContainer = document.getElementById('movie-card-container');
    movieContainer.innerHTML = ''; // 이전 목록 초기화

    const movies = await searchMovies(searchQuery);

    if (movies.length > 0) {
      movies.forEach((movie) => {
        const card = createMovieCard(movie);
        movieContainer.appendChild(card);
      });
    } else {
      movieContainer.innerHTML = '검색 결과가 없습니다.';
    }
  }
});

// API로 영화 검색 요청을 보내는 함수
const searchMovies = async (query) => {
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=ko-KR&query=${query}`;
  try {
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 페이지 로드 시 영화 목록을 가져오도록 호출
fetchMovies();