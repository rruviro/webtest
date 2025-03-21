document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("playButton").addEventListener("click", searchAndPlay);
});

function searchAndPlay() {
    // Get the track name from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const trackName = urlParams.get('track_name');

    if (!trackName) {
        alert("Please provide a song name in the URL (e.g., ?track_name=musika).");
        return;
    }

    fetch(`http://127.0.0.1:5000/search?track=${encodeURIComponent(trackName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("status").innerText = "Error: " + data.error;
            } else {
                document.getElementById("status").innerText = "Streaming: " + data.track_name;

                // Step 1: Display the Spotify Embed Player
                let embedUrl = `https://open.spotify.com/embed/track/${data.track_id}`;
                document.getElementById("spotify_player").src = embedUrl;

                // Step 2: Request the backend to start streaming on active Spotify device
                fetch(`http://127.0.0.1:5000/play?track_uri=${encodeURIComponent(data.spotify_uri)}`, {
                    method: "POST"
                })
                .then(playResponse => playResponse.json())
                .then(playData => {
                    if (playData.error) {
                        document.getElementById("status").innerText = "Error: " + playData.error;
                    } else {
                        document.getElementById("status").innerText = "Now Streaming: " + data.track_name;
                    }
                })
                .catch(error => {
                    document.getElementById("status").innerText = "Playback Error: " + error;
                });
            }
        })
        .catch(error => {
            document.getElementById("status").innerText = "Error: " + error;
        });
}
