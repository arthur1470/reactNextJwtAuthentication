import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/apiClient";
import Router from 'next/router'
import { destroyCookie, parseCookies, setCookie } from "nookies";

type User = {
    email: string;
    permissions: string[];
    roles: string[];    
}

type SignInCredentials = {
    email: string;
    password: string;
};

type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
    isAuthenticated: boolean;
    user: User;
};

type AuthProviderProps = {
    children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel;

export function signOut() {
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')

    authChannel.postMessage('signOut');

    Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    useEffect(() => {
        authChannel = new BroadcastChannel('auth');

        authChannel.onmessage = (message) => {
            if(message.data === 'signOut') signOut();

            if(message.data === 'signIn') Router.push('/dashboard')
            
        }
    }, [])

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies();
        
        if (token) {
            api.get('/me').then(response => {
                const { email, permissions, roles } = response.data

                setUser({ email, permissions, roles })
            })
            .catch(() => {
               signOut
            });
        }    

    }, [])

    async function signIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post('sessions', {
                email,
                password
            })
            
            const {token, refreshToken, permissions, roles} = response.data;

            setUser({
                email,
                permissions,
                roles
            })        
            
            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/'
            })

            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            
            Router.push('/dashboard')
            authChannel.postMessage('signIn');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut}} >
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);