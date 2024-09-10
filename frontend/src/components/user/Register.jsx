import { toast } from 'react-hot-toast';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../actions/authAction';
import { clearAuthError } from '../../slices/authSlice';
import MetaData from '../layout/MetaData';

// formik validation
const validate = values => {
    const errors = {};
    // check if name is valid
    if (!values.username) {
        errors.username = 'Required';
    } else if (values.username.length > 15) {
        errors.username = 'Must be 15 characters or less';
    }

    // check if email is valid
    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    // check if password is valid
    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 6 || values.password.length > 20) {
        errors.password = 'Password must be 6-20 characters';
    }

    // check if phoneno is valid
    if (!values.phoneno) {
        errors.phoneno = 'Required';
    } else if (values.phoneno.length !== 10) {
        errors.phoneno = 'Invalid phone number';
    }

    return errors;
};

const Register = ({ setBgImage }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    setBgImage("bg-[url('/src/assets/train_background.jpg')]");
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const { loading, error, isAuthenticatedUser } = useSelector(state => state.authState);
    const [avatarPreview, setAvatarPreview] = useState('/src/assets/default_avatar.png');

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

    // formik form
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            phoneno: '',
            avatar: null
        },
        validate,
        onSubmit: values => {
            const formData = new FormData();
            formData.append('username', values.username);
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('phoneno', values.phoneno);
            if (values.avatar) {
                formData.append('avatar', values.avatar);
            }

            dispatch(registerUser(values));
        },
    })

    // handle avatar change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            formik.setFieldValue('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'top-center',
                style: {
                    // background: '#FF4C4C',
                    // color: '#fff'
                }
            });
            dispatch(clearAuthError());
        }
        if (isAuthenticatedUser) {
            navigate('/');
        }
    }, [error, isAuthenticatedUser]);

    return (
        <main >
            <MetaData title={"Register"} />
            <div className="container p-2 md:p-5 ">
                <form onSubmit={formik.handleSubmit} className="flex justify-start md:ms-6 lg:ms-28">
                    <section className="w-full md:w-1/2 lg:w-1/3 p-5 lg:p-5 bg-white rounded">
                        <h3 className="text-3xl font-bold text-center p-2">Register</h3>
                        <article className=" md:p-2 my-2 w-full ">
                            <label htmlFor="name" className="text-gray-500 text-sm font-semibold">Name</label>
                            <input type="text" id="name"
                                name='username'
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                                placeholder="Ex: johndeo" />
                            {/* display message if username is invalid */}
                            {
                                formik.errors.username && formik.touched.username ? (
                                    <span className="text-red-500 text-sm flex gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                        </svg>
                                        <span className='my-auto'>{formik.errors.username}</span>
                                    </span>
                                ) : null
                            }
                        </article>
                        <article className=" md:p-2 my-2 w-full ">
                            <label htmlFor="email" className="text-gray-500 text-sm font-semibold">Email</label>
                            <input type="email" id="email"
                                name='email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                                placeholder="Ex: johndeo@gmail.com" />
                            {/* display message if email is invalid */}
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
                                <input type="password" id="password"
                                    name='password'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
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
                            {/* display message if password is invalid */}
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
                        <article className=" md:p-2 my-2 w-full ">
                            <label htmlFor="phone_no" className="text-gray-500 text-sm font-semibold">Phone No</label>
                            <input type="tel" id="phone_no"
                                name='phoneno'
                                value={formik.values.phoneno}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className=" w-full border-b-2 border-gray-300 text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                                placeholder="Enter Your Phone no" />
                            {/* display message if phoneno is invalid */}
                            {
                                formik.errors.phoneno && formik.touched.phoneno ? (
                                    <span className="text-red-500 text-sm flex gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                        </svg>
                                        <span className='my-auto'>{formik.errors.phoneno}</span>
                                    </span>
                                ) : null
                            }
                        </article>
                        <article className=" md:p-2 my-2 w-full ">
                            <label htmlFor="avatar" className="text-gray-500 text-sm font-semibold">Choose Avatar</label>
                            <div className="flex border-2 rounded">
                                <img src={avatarPreview} className="my-auto h-10 w-10 m-2" alt="avatar" />
                                <input type="file" id="avatar"
                                    onChange={handleAvatarChange}
                                    name='avatar'
                                    accept="image/*"
                                    className=" w-full mt-3 my-auto text-md text-gray-700 font-semibold h-10 outline-none" />
                            </div>
                        </article>

                        <article className="text-center p-2 mt-4">
                            <button type='submit' onClick={formik.handleSubmit} className="bg-gray-900 text-white px-12 py-2 rounded text-md font-semibold">
                                {
                                    loading ? (
                                        <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                                    ) : <span >REGISTER</span>
                                }
                            </button>
                        </article>

                        <p className="text-gray-500 font-semibold text-center text-sm my-5">Already have an account?
                            <Link to={"/login"} className="text-blue-500 font-semibold text-sm hover:underline"> Login</Link>
                        </p>


                    </section>
                </form>
            </div>
        </main>
    )
}

export default Register