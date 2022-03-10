import axios, { AxiosError } from 'axios';
import { responseSymbol } from 'next/dist/server/web/spec-compliant/fetch-event';
import { parseCookies, setCookie } from 'nookies'

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];

export const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`
    }
})

api.interceptors.response.use(res => res, (error:AxiosError) => {
    
    if(error.response.status === 401) {
        if (error.response.data?.code === 'token.expired') {
            cookies = parseCookies();
            const refreshToken = cookies['nextauth.refreshToken'];
            const originalConfig = error.config;

            if(!isRefreshing) {
                isRefreshing = true;

                api.post('/refresh', {
                    refreshToken
                }).then(response => {
                    const { token } = response.data;
                    
                    setCookie(undefined, 'nextauth.token', token, {
                        maxAge: 60 * 60 * 24 * 30, // 30 days
                        path: '/'
                    })
        
                    setCookie(undefined, 'nextauth.refreshToken', response.data.refreshToken, {
                        maxAge: 60 * 60 * 24 * 30,
                        path: '/'
                    })
    
                    api.defaults.headers['Authorization'] = `Bearer ${token}`;

                    failedRequestsQueue.forEach(request => request.onSuccess(token));
                    failedRequestsQueue = [];
                }).catch(err => {
                    failedRequestsQueue.forEach(request => request.onFailure(err))
                    failedRequestsQueue = [];
                }).finally(() => {
                    isRefreshing = false
                })
            }

            return new Promise((resolve, reject) => {
                failedRequestsQueue.push({
                    onSuccess: (token: string) => {
                        originalConfig.headers['Authorization'] = `Bearer ${token}`

                        resolve(api(originalConfig))
                    },
                    onFailure: (err: AxiosError) => {
                        reject(err); 
                    } 
                })
            })        
        } else {

        }
        
        
    }
} )