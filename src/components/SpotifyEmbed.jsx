
const spotifyTracks = [
  {
    id: "alfaaz",
    title: "Alfaaz",
    url: "https://open.spotify.com/embed/track/0tW2gwaRzFQQrgr2UCO56G",
  },
  {
    id: "oh-sahib",
    title: "Oh Sahib",
    url: "https://open.spotify.com/embed/track/6I8ImLg9xfoVRNmcV83mL6",
  },
  {
    id: "bff",
    title: "BFF",
    url: "https://open.spotify.com/embed/track/5J9L7IbadCt0ivs9xmNrr0",
  },
];

export default function SpotifyEmbed() {
  return (
    <section className="spotify-embed-section">
      <h2>Your Favourite Songs 🎧</h2>

      <div className="spotify-track-grid">
        {spotifyTracks.map((song) => (
          <div className="spotify-track-card" key={song.id}>
            <h3>{song.title}</h3>

            <iframe  title={song.title} src={song.url} width="100%" height="152" style={{ border: 0, borderRadius: 12 }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
