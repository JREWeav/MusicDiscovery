import axios, { CanceledError } from "axios";
import qs from "qs";
import {Buffer}from "buffer";

const client_id = import.meta.env.VITE_SPOTIFY_API_ID; // Your client id
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET; // Your secret
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

export const getAuth = async () => {
  try{
    const token_url = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({'grant_type':'client_credentials'});

    const response = await axios.post(token_url, data, {
      headers: { 
        'Authorization': `Basic ${auth_token}`,
        'Content-Type': 'application/x-www-form-urlencoded' 
      }
    })
    return response.data.access_token;
  }catch(error){
    console.log(error);
  }
}


export default axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: { Authorization: "Bearer " + await getAuth() },
});

export { CanceledError };
