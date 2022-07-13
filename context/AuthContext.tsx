import {createContext, ReactNode, useEffect, useState} from 'react'
import Router from 'next/router';
import {api} from "../services/api";
import {parseCookies, setCookie} from 'nookies'

type User = {
  email: string,
  permissions: string[],
  roles: string[]
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();
    if (token) {
      api.get('/me').then(response => {
        const { email, roles, permissions } = response.data;
        setUser({ email, permissions, roles });
      });
    }
  }, []);
  
  async function signIn({email, password}: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      })
      console.log(response.data);

      const {token, refreshToken, permissions, roles} = response.data;

      /* Primeiro parametro undefined quando for via browser */
      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      });
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      });

      setUser({
        email,
        permissions,
        roles,
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider value={{signIn, isAuthenticated, user}}>
      {children}
    </AuthContext.Provider>
  )
}
