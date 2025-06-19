import axios from "axios";
import { BASE_URL } from "../config/api";


export const adminLogin = async (email, password) => {
    try {
        const response =await axios.post(`${BASE_URL}/auth/login`, {
            email, password
        })
        return response.data
    } catch (error) {
        throw error
    }
}