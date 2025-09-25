import axios from "axios"

// const BASE_URL = "https://api.duboisbeauty.co.ke/api/v1/";

const BASE_URL = "http://localhost:8800/api/v1/";
const BASE_URL1 = "http://localhost:9100/api/";

export const userRequest = axios.create({
    baseURL: BASE_URL
})


export const paymentRequest = axios.create({
    baseURL: BASE_URL1
})
