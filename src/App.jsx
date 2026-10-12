import { useEffect, useRef, useState } from "react";
import "./App.css";
import { songs } from "./data/songs";
import SpotifyEmbed from "./components/SpotifyEmbed";

const playlists = [
  { name: "Liked Songs", icon: "♥", color: "#6258d9" },
  { name: "Daily Mix", icon: "♫", color: "#be5e83" },
  { name: "Chill Hits", icon: "☁", color: "#327c91" },
  { name: "Focus Flow", icon: "◉", color: "#8b7548" },
];

function formatTime(time) {
  if (!Number.isFinite(time) || time < 0) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function App() {
  const audioRef = useRef(null);

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Home");
  const [likedSongs, setLikedSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [audioError, setAudioError] = useState("");
   const [showProfileMenu, setShowProfileMenu] = useState(false);
  const selectTab = (tab) => {
    setActiveTab(tab);
    setQuery("");
  };

  const greeting =
    new Date().getHours() < 12
      ? "morning"
      : new Date().getHours() < 18
      ? "afternoon"
      : "evening";

  const filteredSongs = songs.filter((song) => {
    const searchText = query.trim().toLowerCase();

    const matchesSearch =
      song.title.toLowerCase().includes(searchText) ||
      song.artist.toLowerCase().includes(searchText) ||
      song.album.toLowerCase().includes(searchText);

    const matchesLiked =
      activeTab !== "Liked Songs" ||
      likedSongs.includes(song.id);

    return matchesSearch && matchesLiked;
  });

  const toggleLike = (songId) => {
    setLikedSongs((previous) =>
      previous.includes(songId)
        ? previous.filter((id) => id !== songId)
        : [...previous, songId]
    );
  };

  const playSong = (song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }
      return;
    }

    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(0);
    setAudioError("");
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong) return;

    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
        setAudioError(
          "Audio play nahi hua. Dusra song try karo."
        );
      });
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying, volume]);

  const handleSeek = (event) => {
    const audio = audioRef.current;

    if (!audio || !Number.isFinite(audio.duration)) return;

    const newTime = Number(event.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const playNext = () => {
    if (!currentSong) {
      if (songs.length > 0) playSong(songs[0]);
      return;
    }

    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const nextSong = songs[(currentIndex + 1) % songs.length];

    setCurrentSong(nextSong);
    setCurrentTime(0);
    setDuration(0);
    setAudioError("");
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (!currentSong) {
      if (songs.length > 0) playSong(songs[0]);
      return;
    }

    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const previousIndex =
      (currentIndex - 1 + songs.length) % songs.length;

    setCurrentSong(songs[previousIndex]);
    setCurrentTime(0);
    setDuration(0);
    setAudioError("");
    setIsPlaying(true);
  };

  return (
    <div className="spotify-app">
      {/* Sidebar */}
      <aside className="sidebar">
        <a
          className="brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            selectTab("Home");
          }}
        >
          <span className="brand-icon">♫</span>
          <span>spotify</span>
        </a>

        <nav className="main-nav">
          <button
            className={
              activeTab === "Home" ? "nav-link active" : "nav-link"
            }
            onClick={() => selectTab("Home")}
          >
            <span>⌂</span> Home
          </button>

          <button
            className={
              activeTab === "Search" ? "nav-link active" : "nav-link"
            }
            onClick={() => selectTab("Search")}
          >
            <span>⌕</span> Search
          </button>
        </nav>

        <div className="library-heading">
          <span>▤</span> Your Library

          <button
            className="icon-button add-button"
            aria-label="Create playlist"
            onClick={() => selectTab("Playlists")}
          >
            +
          </button>
        </div>

        <div className="library-prompt">
          <strong>Create your first playlist</strong>
          <p>It's easy, we'll help you.</p>

          <button
            className="pill-button"
            onClick={() => selectTab("Playlists")}
          >
            Create playlist
          </button>
        </div>

        <div className="sidebar-playlists">
          {playlists.map((playlist) => (
            <button
              key={playlist.name}
              className={
                activeTab === playlist.name
                  ? "playlist-link selected"
                  : "playlist-link"
              }
              onClick={() => selectTab(playlist.name)}
            >
              <span
                className="playlist-icon"
                style={{ background: playlist.color }}
              >
                {playlist.icon}
              </span>

              <span>{playlist.name}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <a href="#privacy" onClick={(e) => e.preventDefault()}>
            Privacy
          </a>

          <a href="#cookies" onClick={(e) => e.preventDefault()}>
            Cookies
          </a>

          <p>Made with ♡ for music lovers</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-panel">
        <header className="topbar">
          <div className="history-buttons">
            <button
              aria-label="Go home"
              onClick={() => selectTab("Home")}
            >
              ‹
            </button>

            <button
              aria-label="Go to search"
              onClick={() => selectTab("Search")}
            >
              ›
            </button>
          </div>

          <label className="search-box">
            <span>⌕</span>

            <input
              value={query}
              onFocus={() => setActiveTab("Search")}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search songs, artists, albums..."
              aria-label="Search songs"
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>
    <div className="profile-wrapper">
          <button
          className="profile-button"
          aria-label="My profile"
          title="My Profile"
        >
          M
        </button>
           {showProfileMenu && (
          <div className="profile-menu">
            <strong>Meghna</strong>
            <span>Spotify Clone</span>

            <button onClick={() => setShowProfileMenu(false)}>
              Close
            </button>
          </div>
        )}
        </div>
        </header>

        <div className="content">
          <section className="welcome-section">
            <p className="eyebrow">YOUR MUSIC. YOUR MOMENT.</p>

            <h1>
              {activeTab === "Search"
                ? "Find your sound"
                : activeTab === "Playlists"
                ? "Your Playlists"
                : activeTab === "Liked Songs"
                ? "Your Liked Songs"
                : `Good ${greeting}`}
            </h1>

            <p className="welcome-subtitle">
              Discover music you love.
            </p>
          </section>

          {activeTab === "Home" && !query && (
            <section className="quick-access">
              {playlists.slice(0, 3).map((playlist) => (
                <button
                  className="quick-card"
                  key={playlist.name}
                  onClick={() => selectTab(playlist.name)}
                >
                  <span
                    className="quick-cover"
                    style={{ background: playlist.color }}
                  >
                    {playlist.icon}
                  </span>

                  <strong>{playlist.name}</strong>
                  <span className="quick-play">▶</span>
                </button>
              ))}
            </section>
          )}

          {/* Dummy songs */}
          <section className="music-section">
            <div className="section-heading">
              <div>
                <h2>
                  {query
                    ? "Search Results"
                    : activeTab === "Liked Songs"
                    ? "Your Favorites"
                    : activeTab === "Playlists"
                    ? "Your Demo Songs"
                    : "Made for You 🎵"}
                </h2>

                <p>
                  Search, like and play your demo songs.
                </p>
              </div>

              <button
                className="show-all"
                onClick={() => selectTab("Home")}
              >
                Show all
              </button>
            </div>

            {filteredSongs.length > 0 ? (
              <div className="song-grid">
                {filteredSongs.map((song) => (
                  <article className="song-card" key={song.id}>
                    <div className="song-cover-wrapper">
                      <img
                        src={song.image}
                        alt={song.title}
                        className="song-cover"
                      />

                      <button
                        className="card-play"
                        onClick={() => playSong(song)}
                        aria-label={`Play ${song.title}`}
                      >
                        {currentSong?.id === song.id && isPlaying
                          ? "Ⅱ"
                          : "▶"}
                      </button>
                    </div>

                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>

                    <button
                      className="like-button"
                      onClick={() => toggleLike(song.id)}
                      aria-label={`Like ${song.title}`}
                    >
                      {likedSongs.includes(song.id)
                        ? "♥ Liked"
                        : "♡ Like"}
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>♫</span>
                <h3>
                  {activeTab === "Liked Songs"
                    ? "No liked songs yet"
                    : "No songs found"}
                </h3>

                <p>
                  {activeTab === "Liked Songs"
                    ? "Like a song to see it here."
                    : "Try another song title, artist or album."}
                </p>

                <button
                  className="pill-button"
                  onClick={() => selectTab("Home")}
                >
                  Browse songs
                </button>
              </div>
            )}
          </section>

          {/* Real Spotify songs */}
          <SpotifyEmbed />

          <section className="made-for-you">
            <div>
              <p className="eyebrow">YOUR DAILY SOUNDTRACK</p>
              <h2>Music for every mood.</h2>
              <p>
                Demo tracks play in the bottom player.
                Original Spotify tracks play in their embedded players.
              </p>
            </div>

            <div className="mood-art">♫</div>
          </section>
        </div>
      </main>

      {/* Bottom player for dummy songs */}
      <footer className="player">
        <div className="now-playing">
          {currentSong ? (
            <>
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="now-cover"
              />

              <div className="now-info">
                <strong>{currentSong.title}</strong>
                <span>{currentSong.artist}</span>
              </div>

              <button
                className="like-button player-like"
                onClick={() => toggleLike(currentSong.id)}
                aria-label="Like currently playing song"
              >
                {likedSongs.includes(currentSong.id) ? "♥" : "♡"}
              </button>
            </>
          ) : (
            <div className="now-info">
              <strong>Select a demo song</strong>
              <span>Your music player</span>
            </div>
          )}
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button
              onClick={playPrevious}
              aria-label="Previous song"
              disabled={!currentSong}
            >
              |◀
            </button>

            <button
              className="main-play-button"
              onClick={() => {
                if (currentSong) {
                  setIsPlaying((previous) => !previous);
                } else if (songs.length > 0) {
                  playSong(songs[0]);
                }
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "Ⅱ" : "▶"}
            </button>

            <button
              onClick={playNext}
              aria-label="Next song"
              disabled={!currentSong}
            >
              ▶|
            </button>
          </div>

          <div className="progress-row">
            <span>{formatTime(currentTime)}</span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              disabled={!currentSong || !duration}
              aria-label="Song progress"
            />

            <span>{formatTime(duration)}</span>
          </div>

          {audioError && (
            <p className="audio-error">{audioError}</p>
          )}
        </div>

        <div className="player-extra">
          <span>🎧</span>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) =>
              setVolume(Number(event.target.value))
            }
            aria-label="Volume"
          />
        </div>

        <audio
          ref={audioRef}
          src={currentSong?.audio || undefined}
          preload="metadata"
          onLoadedMetadata={(event) => {
            setDuration(event.currentTarget.duration || 0);
            setCurrentTime(0);
          }}
          onTimeUpdate={(event) => {
            setCurrentTime(event.currentTarget.currentTime);
          }}
          onEnded={playNext}
          onError={() => {
            if (currentSong) {
              setAudioError(
                "Is demo audio ka link load nahi hua. Dusra song try karo."
              );
              setIsPlaying(false);
            }
          }}
        />
      </footer>
    </div>
  );
}

export default App;
