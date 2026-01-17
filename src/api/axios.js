import axios from 'axios';
import { backendDomain } from '../common';

const axiosInstance = axios.create({
    baseURL: backendDomain,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;
