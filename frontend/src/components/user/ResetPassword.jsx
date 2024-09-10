import React, { useEffect, useState } from 'react'
import MetaData from '../layout/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, clearPasswordReset } from '../../slices/authSlice';
import { useFormik } from 'formik';
import { resetPassword } from '../../actions/authAction';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPassword = ({ setBgImage }) => {

    const dispatch = useDispatch();
    const { token } = useParams();
    const navigate = useNavigate();

    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);
    const { loading, error, isPasswordReseted } = useSelector(state => state.authState);

    // formik form
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validate: (values) => {
            const errors = {};
            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            }
            if (!values.confirmPassword) {
                errors.confirmPassword = 'Required';
            } else if (values.confirmPassword.length < 6) {
                errors.confirmPassword = 'Password must be at least 6 characters';
            } else if (values.confirmPassword !== values.password) {
                errors.confirmPassword = 'Both password does not match';
            }
            return errors;
        },
        // on submit
        onSubmit: (values) => {
            dispatch(resetPassword(values, token));
        }
    })

    const showPassword = () => {
        var x = document.getElementById("new_password");
        if (x.type === "password") {
            x.type = "text";
            setIsPasswordShow(true);
        } else {
            x.type = "password";
            setIsPasswordShow(false);
        }
    }

    const showConfirmPassword = () => {
        var x = document.getElementById("confirm_password");
        if (x.type === "password") {
            x.type = "text";
            setIsConfirmPasswordShow(true);
        } else {
            x.type = "password";
            setIsConfirmPasswordShow(false);
        }
    }

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearAuthError());
        }
        if (isPasswordReseted) {
            toast.success("Password reset successfully");
            dispatch(clearPasswordReset());
            formik.resetForm();
            Navigate('/login', { replace: true });
        }
    }, [error, isPasswordReseted])

    useEffect(() => {
        setBgImage("bg-[url('/src/assets/train_background.jpg')]");
    }, []);

    return (
        <>
            <MetaData title={"Reset Password"} />
            <div className="container p-2 md:p-5 ">
                <form onSubmit={formik.handleSubmit} className="flex justify-start md:ms-6 lg:ms-28 my-8">
                    <section className="w-full md:w-1/2 lg:w-1/3 p-2 lg:p-5 bg-white rounded">
                        <h3 className="text-3xl font-bold text-center p-2">Reset Password</h3>

                        <article className=" md:p-2 my-2 w-full ">
                            <label htmlFor="new_password" className="text-gray-500 text-sm font-semibold">New Password</label>
                            <div className="flex border-b-2 border-gray-300">
                                <input type="password" id="new_password" name='password' onChange={formik.handleChange} value={formik.values.password} onBlur={formik.handleBlur}
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
                            <label htmlFor="confirm_password" className="text-gray-500 text-sm font-semibold">Confirm
                                Password</label>
                            <div className="flex border-b-2 border-gray-300">
                                <input type="password" id="confirm_password"
                                    name='confirmPassword' onChange={formik.handleChange} value={formik.values.confirmPassword} onBlur={formik.handleBlur}
                                    className=" w-full  text-md text-gray-700 font-semibold h-10 outline-none focus:border-t-transparent focus:border-gray-600"
                                    placeholder="Ex: Enter Your Password" />
                                {
                                    isConfirmPasswordShow ? (
                                        <span className="my-auto me-1 hover:cursor-pointer" onClick={showConfirmPassword}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        </span>
                                    ) : (

                                        <span className="my-auto me-1 hover:cursor-pointer" onClick={showConfirmPassword}>
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
                            {/* display message if confirmPassword is invalid */}
                            {
                                formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                                    <span className="text-red-500 text-sm flex gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                        </svg>
                                        <span className='my-auto'>{formik.errors.confirmPassword}</span>
                                    </span>
                                ) : null
                            }
                        </article>

                        <article className="text-center p-2 mt-4">
                            <button type='submit' onClick={formik.handleSubmit} className="bg-gray-900 text-white w-44 h-10 rounded text-md font-semibold">
                                {
                                    loading ? (
                                        <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                                    ) : <span >SAVE</span>
                                }</button>
                        </article>

                    </section>
                </form>
            </div>
        </>
    )
}

export default ResetPassword