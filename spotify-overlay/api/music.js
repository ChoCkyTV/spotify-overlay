import axios from "axios";

const CLIENT_ID = "74f153a994214cc695abbf32bb38d8b5";
const CLIENT_SECRET = "67ebeb0fd2a547c4b3ed9f34fc65335a";
const REFRESH_TOKEN = "BQAwWJ8SoQXNAlFOKHD5crJ4Ex2rH29VEZLpmEtu2-sVtfiFpbaNQtMXiw0n4-fMQDvN8IBsP-uazNNT0QEkUayxiw1E7RHHR1-Q2qwcNIzxhLTzqdNdNGcuI6P2oz8rYqg1rfPLGQGQs7j6wghymEOZsr2EWMQDD8l7IgKttujItiaG8_QGLGrF6qAZyMgEeeNGTLsqZrzGdrf-_f14Uk_RCdS4KRa9QdRN8A";
const YOUTUBE_KEY = "AIzaSyCHwHu4OnWCeOn-SdJHvJL1x_sOKVYnMhI";

export default async function handler(req, res) {
  try {
    const token = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const access_token = token.data.access_token;

    const trackRes = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!trackRes.data || !trackRes.data.item) {
      return res.json({});
    }

    const title = trackRes.data.item.name;
    const artist = trackRes.data.item.artists[0].name;

    const yt = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: `${title} ${artist} official music video`,
          key: YOUTUBE_KEY,
          maxResults: 1,
          type: "video",
        },
      }
    );

    const videoId = yt.data.items[0]?.id?.videoId;

    res.json({ title, artist, videoId });
  } catch (e) {
    res.json({});
  }
}