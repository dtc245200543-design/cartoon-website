const movies = [
  {
    id: "big-buck-bunny",
    title: "Big Buck Bunny · Trailer",
    subtitle: "Phim ngắn của Blender Foundation",
    duration: "Trailer",
    views: 12840,
    updated: "2026-10-11",
    emoji: "🐰",
    theme: "forest",
    description: "Trailer phim hoạt hình Big Buck Bunny, tác phẩm của Blender Foundation.",
    videoUrl: "https://media.w3.org/2010/05/bunny/trailer.mp4",
    youtubeId: "aqz-KE-bpKQ",
  },
  {
    id: "sintel",
    title: "Sintel · Trailer",
    subtitle: "Phim ngắn của Blender Foundation",
    duration: "Trailer",
    views: 9630,
    updated: "2026-10-08",
    emoji: "🐉",
    theme: "moon",
    description: "Trailer Sintel, phim hoạt hình phiêu lưu do Blender Foundation thực hiện.",
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    youtubeId: "eRsGyueVLvQ",
  },
];

const movieList = document.querySelector("#movie-list");
const movieCount = document.querySelector("#movie-count");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const emptyState = document.querySelector("#empty-state");
const video = document.querySelector("#video-player");
const youtube = document.querySelector("#youtube-player");
const videoFrame = document.querySelector(".video-frame");
const overlay = document.querySelector("#video-overlay");
const title = document.querySelector("#player-title");
const description = document.querySelector("#player-description");
const views = document.querySelector("#player-views");
const favoriteButton = document.querySelector("#favorite-button");
const localSourceButton = document.querySelector("#local-source");
const youtubeSourceButton = document.querySelector("#youtube-source");

let selectedMovieId = movies[0].id;
let selectedSource = "video";
let favoriteMovieIds = new Set();

function formatViews(count) {
  return new Intl.NumberFormat("vi-VN").format(count);
}

function visibleMovies() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase("vi");
  const matchingMovies = movies.filter((movie) =>
    `${movie.title} ${movie.subtitle}`.toLocaleLowerCase("vi").includes(searchTerm),
  );

  if (sortSelect.value === "popular") {
    return matchingMovies.sort((first, second) => second.views - first.views);
  }

  return matchingMovies.sort(
    (first, second) => new Date(second.updated) - new Date(first.updated),
  );
}

function renderMovies() {
  const filteredMovies = visibleMovies();
  movieList.replaceChildren();
  movieCount.textContent = String(filteredMovies.length);
  emptyState.hidden = filteredMovies.length !== 0;

  for (const movie of filteredMovies) {
    const item = document.createElement("button");
    item.className = `movie-item${movie.id === selectedMovieId ? " is-selected" : ""}`;
    item.type = "button";
    item.setAttribute("aria-current", movie.id === selectedMovieId ? "true" : "false");
    item.setAttribute("aria-label", `Phát phim ${movie.title}`);

    const thumbnail = document.createElement("span");
    thumbnail.className = `movie-thumb thumb-${movie.theme}`;
    thumbnail.setAttribute("aria-hidden", "true");
    thumbnail.append(document.createTextNode(movie.emoji));

    const playIcon = document.createElement("span");
    playIcon.className = "thumb-play";
    playIcon.textContent = "▶";
    thumbnail.append(playIcon);

    const copy = document.createElement("span");
    copy.className = "movie-copy";

    const movieTitle = document.createElement("span");
    movieTitle.className = "movie-name";
    movieTitle.textContent = movie.title;

    const movieSubtitle = document.createElement("span");
    movieSubtitle.className = "movie-subtitle";
    movieSubtitle.textContent = movie.subtitle;
    copy.append(movieTitle, movieSubtitle);

    const duration = document.createElement("span");
    duration.className = "movie-duration";
    duration.textContent = movie.duration;

    item.append(thumbnail, copy, duration);
    item.addEventListener("click", () => selectMovie(movie.id));
    movieList.append(item);
  }
}

function updatePlayerSource() {
  const movie = movies.find((item) => item.id === selectedMovieId);
  if (!movie) {
    throw new Error(`Không tìm thấy phim có mã "${selectedMovieId}".`);
  }

  if (selectedSource === "youtube") {
    video.pause();
    video.hidden = true;
    youtube.hidden = false;
    youtube.src = `https://www.youtube-nocookie.com/embed/${movie.youtubeId}?rel=0`;
    overlay.hidden = true;
    localSourceButton.classList.remove("is-selected");
    localSourceButton.setAttribute("aria-pressed", "false");
    youtubeSourceButton.classList.add("is-selected");
    youtubeSourceButton.setAttribute("aria-pressed", "true");
  } else {
    youtube.src = "";
    youtube.hidden = true;
    video.hidden = false;
    video.src = movie.videoUrl;
    video.load();
    overlay.hidden = false;
    videoFrame.classList.remove("is-playing");
    localSourceButton.classList.add("is-selected");
    localSourceButton.setAttribute("aria-pressed", "true");
    youtubeSourceButton.classList.remove("is-selected");
    youtubeSourceButton.setAttribute("aria-pressed", "false");
  }
}

function selectMovie(movieId) {
  const movie = movies.find((item) => item.id === movieId);
  if (!movie) {
    throw new Error(`Không tìm thấy phim có mã "${movieId}".`);
  }

  selectedMovieId = movieId;
  title.textContent = movie.title;
  description.textContent = movie.description;
  views.textContent = `${formatViews(movie.views)} lượt xem mẫu`;
  youtube.title = `Trailer ${movie.title} trên YouTube`;
  favoriteButton.setAttribute("aria-pressed", String(favoriteMovieIds.has(movieId)));
  favoriteButton.querySelector(".favorite-label").textContent = favoriteMovieIds.has(movieId)
    ? "Đã yêu thích"
    : "Yêu thích";
  updatePlayerSource();
  renderMovies();
}

searchInput.addEventListener("input", renderMovies);
sortSelect.addEventListener("change", renderMovies);

localSourceButton.addEventListener("click", () => {
  if (selectedSource !== "video") {
    selectedSource = "video";
    updatePlayerSource();
  }
});

youtubeSourceButton.addEventListener("click", () => {
  if (selectedSource !== "youtube") {
    selectedSource = "youtube";
    updatePlayerSource();
  }
});

favoriteButton.addEventListener("click", () => {
  if (favoriteMovieIds.has(selectedMovieId)) {
    favoriteMovieIds.delete(selectedMovieId);
  } else {
    favoriteMovieIds.add(selectedMovieId);
  }

  const isFavorite = favoriteMovieIds.has(selectedMovieId);
  favoriteButton.setAttribute("aria-pressed", String(isFavorite));
  favoriteButton.querySelector(".favorite-label").textContent = isFavorite
    ? "Đã yêu thích"
    : "Yêu thích";
});

video.addEventListener("play", () => videoFrame.classList.add("is-playing"));
video.addEventListener("pause", () => videoFrame.classList.remove("is-playing"));

document.addEventListener("keydown", (event) => {
  if (
    event.key === "/" &&
    !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
  ) {
    event.preventDefault();
    searchInput.focus();
  }
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
renderMovies();
selectMovie(selectedMovieId);
