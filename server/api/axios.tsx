import axios from "axios"
const dev = "http://localhost:3000"
const production = "https://audit-tracker-api.onrender.com"
export default axios.create({
    baseURL: dev,
    headers: {
        "Content-Type": "application/json",
      },
})