import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const isLogin = useSelector(state => state.isLogin);
    const [ userLogin, setUserLogin ] = useState({ email: "", password: ""});

    function handleChange(e) {
        e.preventDefault();
        setUserLogin(currUserLogin => {
            return { ...currUserLogin, [e.target.id]:e.target.value}
        })
    }

    function handleSubmit(e) {
        e.preventDefault();
        authenticateUser();
    }

    function authenticateUser() {
        fetch('http://localhost:8080/login', {
            method: 'POST',
            body: JSON.stringify(userLogin),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then((response) => {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error(response.status)
            }
        })
        .then(data => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("id", data.id);
            dispatch({type: 'LOGIN'});

            if (location.state) {
                navigate(`${location.state.from.pathname}`)
            } else {
                navigate('/');
            }
            console.log("Login Success.");
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="mx-auto max-w-screen-md py-5 px-10">
            <div className="mb-10" id="header">
                <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">
                    Login to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-700">
                Don't have an account yet? <span> </span>
                <NavLink to='/register' className="font-medium text-blue-800 hover:text-blue-500">
                    Register
                </NavLink>
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="-space-y-px">
                    <div className="my-5">
                        <label htmlFor='email' className="sr-only">
                        Email
                        </label>
                        <input
                        onChange={handleChange}
                        value={userLogin.email}
                        id="email"
                        name="email"
                        type="email"
                        className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                        />
                    </div>
                    <div className="my-5">
                        <label htmlFor='password' className="sr-only">
                        Password
                        </label>
                        <input
                        onChange={handleChange}
                        value={userLogin.password}
                        id="password"
                        name="password"
                        type="password"
                        className="my-5 rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="my-5 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-10"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
