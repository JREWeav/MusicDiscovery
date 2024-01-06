import axios, { CanceledError } from "axios";

export default axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: { Authorization: "Bearer cb66115b7dcd4ce38ed91958cbce0ee9" },
});

export { CanceledError };
