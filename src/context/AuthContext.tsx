import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import {
  initiateLogin,
  exchangeCodeForTokens,
  refreshAccessToken,
  storeTokens,
  getStoredTokens,
  clearTokens,
} from '../services/spotify/auth'
import { spotifyAPI } from '../services/spotify/api'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  error: string | null
}

interface AuthContextType extends AuthState {
  login: () => void
  logout: () => void
  handleCallback: (code: string, state: string) => Promise<void>
  getAccessToken: () => Promise<string>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    accessToken: null,
    error: null,
  })

  useEffect(() => {
    const checkStoredAuth = async () => {
      const tokens = getStoredTokens()

      if (tokens) {
        if (Date.now() >= tokens.expiresAt) {
          try {
            const newTokens = await refreshAccessToken(tokens.refreshToken)
            storeTokens(newTokens)
            spotifyAPI.setAccessToken(newTokens.access_token)
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              accessToken: newTokens.access_token,
              error: null,
            })
          } catch {
            clearTokens()
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              accessToken: null,
              error: 'Session expired',
            })
          }
        } else {
          spotifyAPI.setAccessToken(tokens.accessToken)
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            accessToken: tokens.accessToken,
            error: null,
          })
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          accessToken: null,
          error: null,
        })
      }
    }

    checkStoredAuth()
  }, [])

  const handleCallback = useCallback(async (code: string, state: string) => {
    const storedState = sessionStorage.getItem('spotify_auth_state')

    if (state !== storedState) {
      throw new Error('State mismatch - possible CSRF attack')
    }

    const tokens = await exchangeCodeForTokens(code)
    storeTokens(tokens)
    spotifyAPI.setAccessToken(tokens.access_token)

    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      accessToken: tokens.access_token,
      error: null,
    })
  }, [])

  const login = useCallback(() => {
    initiateLogin()
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      error: null,
    })
  }, [])

  const getAccessToken = useCallback(async (): Promise<string> => {
    const tokens = getStoredTokens()

    if (!tokens) {
      throw new Error('Not authenticated')
    }

    if (Date.now() >= tokens.expiresAt - 5 * 60 * 1000) {
      const newTokens = await refreshAccessToken(tokens.refreshToken)
      storeTokens(newTokens)
      spotifyAPI.setAccessToken(newTokens.access_token)
      setAuthState(prev => ({
        ...prev,
        accessToken: newTokens.access_token,
      }))
      return newTokens.access_token
    }

    return tokens.accessToken
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        handleCallback,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
