import axios from 'axios';

export const baseURL = "http://localhost:21105/"
// export const baseURLDeploy = "http://localhost:3000/"
export const baseURLDeploy = "http://syscoderweb.com/"    //to generate frontend routes
// export const baseURL = "http://proespeciais.kinghost.net/"      //To conect with backend

const api = axios.create({
    baseURL:baseURL
})

export default api;