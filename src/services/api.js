import axios from 'axios';

// export const baseURL = "http://localhost:21105/"
// export const baseURLDeploy = "http://localhost:3000/"
export const baseURLDeploy = "http://proespeciais.kinghost.net/"
export const baseURL = "http://proespeciais.kinghost.net/"

const api = axios.create({
    baseURL:baseURL
})

export default api;