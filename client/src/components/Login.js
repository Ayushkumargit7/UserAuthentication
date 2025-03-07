import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { login, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { email, password } = formData;
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearError();
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    await login({ email, password });
    // navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-500 to-blue-900">
      <div className="bg-slate-900 rounded-lg p-8 w-full max-w-md shadow-xl">
      <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
        </div>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <div className="flex items-center bg-gray-700 rounded-md px-3 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Email"
                required
                className="bg-transparent w-full p-2 text-white focus:outline-none"
              />
            </div>
            
            <div className="flex items-center bg-gray-700 rounded-md px-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                required
                className="bg-transparent w-full p-2 text-white focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-teal-300 mb-6">
            <label className="flex items-center text-cyan-400 hover:text-cyan-300">
              <input type="checkbox" className="mr-1 " />
              Remember me
            </label>
            <a href="#" className="text-cyan-400 hover:text-cyan-300">Forgot password?</a>
          </div>
          
          <button
            type="submit"
            className="w-full bg-cyan-400 text-slate-900 py-3 rounded-lg font-semibold hover:bg-cyan-300 transition duration-200"
          >
            Login
          </button>
          
          <p className="text-center text-cyan-400 hover:text-cyan-300 mt-2">
            Don't have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;