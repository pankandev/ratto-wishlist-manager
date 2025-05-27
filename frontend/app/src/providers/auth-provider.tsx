import React, {createContext, useContext, useState} from 'react';
import {callJsonApi} from "@/lib/http-helper.ts";
import {z} from "zod";
import {AppError} from "@/lib/app-error.ts";

export interface RegisterCredentials {
    email: string;
    password: string;
}

export interface AuthContextValue {
    tokenSnapshot: string | null;
    getToken(): Promise<string | null>;
    isLoggedInSnapshot: boolean;
    isLoggedIn(): Promise<boolean>;
    login(credentials: LoginCredentials): Promise<boolean>;
    register(credentials: RegisterCredentials): Promise<void>;
    logout(): void;
}

const StorageJWTAccessKey = 'django-jwt-access';
const StorageJWTRefreshKey = 'django-jwt-refresh';
const AuthContext = createContext<AuthContextValue>({
    getToken: () => Promise.resolve(null),
    isLoggedInSnapshot: false,
    tokenSnapshot: null,
    isLoggedIn: () => Promise.resolve(false),
    login: () => Promise.resolve(false),
    register: () => Promise.resolve(),
    logout: () => null,
});


export interface LoginCredentials {
    email: string;
    password: string;
}


export const LoginResponseSchema = z.object({
    access: z.string(),
    refresh: z.string(),
});

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem(StorageJWTAccessKey) || null);
    const [, setRefreshToken] = useState<string | null>(localStorage.getItem(StorageJWTRefreshKey) || null);

    async function login(credentials: LoginCredentials): Promise<boolean> {
        const response = await callJsonApi({
            path: '/api/token/',
            body: {
                email: credentials.email,
                password: credentials.password
            },
            method: 'POST'
        });
        if (!response.ok) {
            if (response.status == 401) {
                return false;
            }
            throw await AppError.fromResponse(response);
        }
        const parsed = LoginResponseSchema.parse(await response.json());
        localStorage.setItem(StorageJWTAccessKey, parsed.access);
        localStorage.setItem(StorageJWTRefreshKey, parsed.refresh);
        setToken(parsed.access);
        setRefreshToken(parsed.refresh);
        return true;
    }
    return (
        <AuthContext.Provider value={{
            async getToken(): Promise<string | null> {
                // TODO: Decode and refresh token if needed
                return token;
            },
            isLoggedInSnapshot: token !== null,
            tokenSnapshot: token,
            async isLoggedIn(): Promise<boolean> {
                return token !== null;
            },
            async login(credentials: LoginCredentials): Promise<boolean> {
                return login(credentials);
            },
            async register(credentials: RegisterCredentials): Promise<void> {
                const response = await callJsonApi({
                    path: '/api/v1/accounts/',
                    method: 'POST',
                    body: {
                        'email': credentials.email,
                        'password': credentials.password,
                    },
                });
                if (!response.ok) {
                    throw await AppError.fromDRFError(response);
                }
                await login({
                    email: credentials.email,
                    password: credentials.password
                });
            },
            async logout(): Promise<void> {
                localStorage.removeItem(StorageJWTAccessKey);
                localStorage.removeItem(StorageJWTRefreshKey);
                setToken(null);
                setRefreshToken(null);
            },
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
}
