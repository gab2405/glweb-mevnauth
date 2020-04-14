const { API_URL } = require("@/constants.js");
const SECRET_URL = API_URL + "/auth/secret";
import axios from 'axios';

export const getSecret = async()=>{
    try {
        let response = await axios.get(SECRET_URL, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`
            }
        })
        return response.data.secret
    } catch (error) {
        console.log(error)
        return false
    }
}