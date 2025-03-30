import axios from "axios"

const BASE_URL = "https://api.duboisbeauty.co.ke/api/v1/";


export const userRequest = axios.create({
    baseURL: BASE_URL
})

