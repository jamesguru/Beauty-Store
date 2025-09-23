import axios from "axios"

// const BASE_URL = "https://api.duboisbeauty.co.ke/api/v1/";

const BASE_URL = "http://localhost:8800/api/v1/";

export const userRequest = axios.create({
    baseURL: BASE_URL
})

