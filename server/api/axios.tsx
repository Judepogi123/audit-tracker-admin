import axios from "axios"
const dev = "http://localhost:3000"
const production = "https://audit-tracker-admin.web.app/"
export default axios.create({
    baseURL: production
})