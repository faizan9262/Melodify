import axios from "axios";

export const moodBasedRecommendations = async (req, res) => {
  // Mapping for building a search query based solely on mood
  const moodToGenreMap = {
    happy: "bubblegum-pop dance-pop indian-pop garba wedding-music",
    sad: "indian-classical ghazal acoustic ambient marathi-bhaktigeet",
    energetic: "edm trap punjabi-bhangra workout tamil-dance",
    romantic: "bollywood-romantic sufi rnb k-pop-ballad bengali-adhunik",
    angry: "nu-metal hardcore indian-metal punk-rock political-rap",
    focused: "hindustani-instrumental ambient-study carnatic-fusion focus-beats",
    excited: "punjabi-bhasha dancehall indian-hiphop pop-dance dandiya",
    nostalgic: "90s-bollywood retro-pop classic-indie old-hindi vintage-telugu",
    calm: "sufi-acoustic ambient-indie indian-folk lo-fi odia-slow",
    motivated: "desi-rap trap-motivation workout indian-drill inspirational",
    neutral: "indian-indie alternative-pop crossover indie-folk lounge-malayalam",
  };

  // Mapping to Spotify's curated categories
  const moodCategoryMap = {
    happy: "party",
    sad: "chill",
    energetic: "workout",
    romantic: "romance",
    angry: "rock",
    focused: "focus",
    excited: "dance",
    nostalgic: "oldies",
    calm: "acoustic",
    motivated: "workout",
    neutral: "pop",
  };

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No access token provided" });
    }

    console.log(token );
    

    const mood = req.query.mood;
    if (!mood) {
      return res.status(400).json({ error: "Mood parameter is required" });
    }

    // Build search query based on mood
    const moodGenres = moodToGenreMap[mood]
      ? moodToGenreMap[mood].split(" ")
      : [];
    const baseQuery = `(${moodGenres.join(" OR ")})`;
    const randomEnhancers = ["mix", "vibes", "hits", "energy", "mood"];
    const randomKeyword =
      randomEnhancers[Math.floor(Math.random() * randomEnhancers.length)];
    const queryParts = [baseQuery, randomKeyword].filter(Boolean);
    const combinedQuery = shuffleArray(queryParts).join(" AND ");

    // API call for search-based playlists
    const searchResponsePromise = axios.get(
      "https://api.spotify.com/v1/search",
      {
        params: {
          q: combinedQuery,
          type: "playlist",
          limit: 15,
          market: "IN",
          offset: Math.floor(Math.random() * 50),
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // API call for curated playlists using category mapping
    const category = moodCategoryMap[mood.toLowerCase()];
    let categoryResponsePromise = Promise.resolve({
      data: { playlists: { items: [] } },
    });
    if (category) {
      categoryResponsePromise = axios
        .get(
          `https://api.spotify.com/v1/browse/categories/${category}/playlists`,
          {
            params: {
              limit: 15,
              market: "IN",
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .catch((err) => {
          console.warn("Category endpoint error:", err.response?.data || err.message);
          return { data: { playlists: { items: [] } } };
        });
    }

    const [searchResponse, categoryResponse] = await Promise.all([
      searchResponsePromise,
      categoryResponsePromise,
    ]);

    const searchPlaylists = searchResponse.data.playlists?.items || [];
    const curatedPlaylists = categoryResponse.data.playlists?.items || [];
    const allResults = [...searchPlaylists, ...curatedPlaylists];
    const uniqueResults = removeDuplicates(allResults);

    const formattedResults = uniqueResults.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      image: playlist.images?.[0]?.url || "",
      type: playlist.type,
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error(
      "Error fetching recommendations:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};

// Helper functions
const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const removeDuplicates = (results) => {
  const seen = new Set();
  return results.filter((item) => {
    if (!item || !item.id) return false;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};
