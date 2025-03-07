import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: localStorage.getItem('token') ? true : false,
  loading: true,
  user: JSON.parse(localStorage.getItem('user')) || null,
  error: null
};

// Create context
export const AuthContext = createContext(initialState);

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user
      };
    case 'AUTH_ERROR':
    case 'REGISTER_FAIL':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token
  const setAuthToken = token => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  // Load user
  const loadUser = async () => {
    // Set token to headers
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('http://localhost:5000/api/users/me');
      
      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      console.error('Error loading user:', err);
      dispatch({ 
        type: 'AUTH_ERROR',
        payload: err.response && err.response.data ? err.response.data.message : 'Authentication error'
      });
    }
  };

  // Register user
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData, config);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
      
      // Set token in headers immediately after registration
      setAuthToken(res.data.token);
      
      // Skip loadUser here as we already have the user info
    } catch (err) {
      console.error('Registration error:', err);
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response && err.response.data ? err.response.data.message : 'Registration failed'
      });
    }
  };

  // Login user
  const login = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData, config);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      
      // Set token in headers immediately after login
      setAuthToken(res.data.token);
      
      // Skip loadUser here as we already have the user info
    } catch (err) {
      console.error('Login error:', err);
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response && err.response.data ? err.response.data.message : 'Login failed'
      });
    }
  };

  // Logout user
  const logout = () => dispatch({ type: 'LOGOUT' });

  // Clear errors
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  // Set token when state changes
  useEffect(() => {
    setAuthToken(state.token);
  }, [state.token]);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearError,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};