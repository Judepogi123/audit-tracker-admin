import axios from "axios"
const dev = "http://localhost:3000"
export default axios.create({
    baseURL: "https://judepogi123.github.io/Audit-tracker-test"
})