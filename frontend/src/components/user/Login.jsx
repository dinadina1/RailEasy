import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode";
import { loginUser, loginwithGoogle } from '../../actions/authAction';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { clearAuthError } from '../../slices/authSlice';
import MetaData from '../layout/MetaData';

const googleClientId = "143006967349-qq42vfddc3jns0r558v4r5efqndldts0.apps.googleusercontent.com"

const Login = ({ setBgImage }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect') || '/';

    setBgImage("bg-[url('/src/assets/train_background.jpg')]");
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [showCredentials, setShowCredentials] = useState(false);

    const { error, loading, isAuthenticatedUser } = useSelector(state => state.authState);

    // function to show password
    const showPassword = () => {
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
            setIsPasswordShow(true);
        } else {
            x.type = "password";
            setIsPasswordShow(false);
        }
    }

    // function to  show credentials
    const showCredentialsHandler = () => {
        setShowCredentials(true);
    }

    // function to close credentials
    const closeCredentialsHandler = () => {
        setShowCredentials(false);
    }

    // function to google login
    const googleLogin = async (res) => {
        const data = jwtDecode(res.credential);
        const formData = {
            email: data.email,
            username: data.name,
            password: data.sub,
            avatar: data.picture
        }

        dispatch(loginwithGoogle(formData));
    }

    // formik form
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate: (values) => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Email is Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Password is Required';
            } else if (values.password.length > 20 || values.password.length < 6) {
                errors.password = 'Password must be at least 6 to 20 characters';
            }
            return errors;
        },
        onSubmit: (values) => {
            dispatch(loginUser(values));
        }
    })

    useEffect(() => {
        if (isAuthenticatedUser) {
            navigate(redirect);
        }
        if (error) {
            toast.error(error, {
                position: 'top-center',
                style: {
                    background: '#FF4C4C',
                    color: '#fff'
                }
            });
            dispatch(clearAuthError());
        }
    }, [error, isAuthenticatedUser, redirect]);

    return (
        <>
            <MetaData title={"Login"} />
            <GoogleOAuthProvider clientId={googleClientId} className="w-fit">
                <div className="container p-2 md:p-5 ">
                    <form className="flex justify-start md:ms-6 lg:ms-28" onSubmit={formik.handleSubmit}>
                        <section className="w-full md:w-1/2 lg:w-1/3 p-2 lg:p-5 rounded bg-white">
                            <h3 className="text-3xl font-bold text-center p-2">Login</h3>
                            <article className=" md:p-2 my-2 w-full ">
                                <label htmlFor="email" className="text-gray-500 text-sm font-semibold">Email</label>
                                <input type="email" id="email" name='email'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                                    placeholder="Ex: johndeo@gmail.com" />
                                {/* display error if email is invalid */}
                                {
                                    formik.errors.email && formik.touched.email ? (
                                        <span className="text-red-500 text-sm flex gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                            </svg>
                                            <span className='my-auto'>{formik.errors.email}</span>
                                        </span>
                                    ) : null
                                }
                            </article>
                            <article className=" md:p-2 my-2 w-full ">
                                <label htmlFor="password" className="text-gray-500 text-sm font-semibold">Password</label>
                                <div className="flex border-b-2 border-gray-300">
                                    <input type="password" id="password" name='password'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                        className=" w-full  text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                                        placeholder="Ex: Enter Your Password" />

                                    {
                                        isPasswordShow ? (
                                            <span className="my-auto me-1 hover:cursor-pointer" onClick={showPassword}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            </span>
                                        ) : (

                                            <span className="my-auto me-1 hover:cursor-pointer" onClick={showPassword}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            </span>
                                        )
                                    }

                                </div>
                                {/* display error if password is invalid */}

                                {
                                    formik.errors.password && formik.touched.password ? (
                                        <span className="text-red-500 text-sm flex gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                            </svg>
                                            <span className='my-auto'>{formik.errors.password}</span>
                                        </span>
                                    ) : null
                                }
                            </article>
                            <article className="text-end me-3 ">
                                <Link to={"/forgotpassword"} className="text-sm text-gray-500  font-semibold hover:underline">Forgot Password</Link>
                            </article>

                            <article className="text-center p-2 mt-4">
                                <button onClick={formik.handleSubmit} type='submit' className="bg-gray-900 text-white px-12 py-2 rounded text-md font-semibold ">
                                    {
                                        loading ? (
                                            <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                                        ) : <span >LOGIN</span>
                                    }

                                </button>
                            </article>
                            <div className="flex justify-center items-center">

                            </div>

                            <p className="text-gray-500 font-semibold text-center text-sm my-2">or </p>

                            <article className="flex justify-center p-2 mt-4">

                                <GoogleLogin
                                    onSuccess={googleLogin}
                                    onError={(e) => {
                                        console.log("Login Failed", e);
                                    }}
                                    useOneTap
                                />

                            </article>

                            <p className="text-gray-500 font-semibold text-center text-sm my-5">Have not account yet?
                                <Link to={"/register"} className="text-blue-500 font-semibold text-sm hover:underline"> Register</Link>
                            </p>
                            <div className="text-center p-2 mt-4">
                                <button onClick={showCredentialsHandler} className="bg-gray-900 text-white font-bold py-2 px-4 rounded hover:bg-gray-950">
                                    Show Credentials
                                </button>
                            </div>
                        </section>
                    </form>

                    {
                        showCredentials && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
                                    <h2 className="text-2xl font-bold mb-4">Login Credentials</h2>
                                    <h5 className="text-gray-700 font-bold text-lg underline text-left">Admin</h5>
                                    <p className="text-gray-700 mb-2"><strong>Email :</strong> admin@gmail.com</p>
                                    <p className="text-gray-700 mb-2"><strong>Password :</strong> 123456</p>
                                    <hr className="my-4" />
                                    <h5 className="text-gray-700 font-bold text-lg underline text-left">User</h5>
                                    <p className="text-gray-700 mb-2"><strong>Email :</strong> hacker@gmail.com</p>
                                    <p className="text-gray-700 mb-2"><strong>Password :</strong> 123456</p>
                                    <hr className="my-4" />
                                    <button
                                        className="bg-gray-200 text-gray-800 border border-gray-600 font-bold py-2 px-4 rounded hover:bg-gray-300"
                                        onClick={closeCredentialsHandler}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </GoogleOAuthProvider>
        </>
    )
}

export default Login