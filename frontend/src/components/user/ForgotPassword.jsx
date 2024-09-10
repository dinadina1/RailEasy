import React, { useEffect } from 'react'
import MetaData from '../layout/MetaData';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { clearAuthError, clearMailSent } from '../../slices/authSlice';
import { forgotPassword } from '../../actions/authAction';

const ForgotPassword = ({ setBgImage }) => {

    const dispatch = useDispatch();
    const { loading, isMailSent, error } = useSelector(state => state.authState);

    // formik form
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validate: values => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            return errors;
        },
        // on submit
        onSubmit: (values) => {
            dispatch(forgotPassword(values));
        }
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearAuthError());
        }
        if (isMailSent) {
            toast.success("Mail sent successfully");
            dispatch(clearMailSent());
            formik.resetForm();
        }
    }, [error, isMailSent])

    useEffect(() => {
        setBgImage("bg-[url('/src/assets/train_background.jpg')]");
    }, []);

    return (
        <>
            <MetaData title={"Forgot Password"} />
            <div className="container p-2 md:p-5">
                <form onSubmit={formik.handleSubmit} className="flex justify-start md:ms-6 lg:ms-28 my-8">
                    <section className="w-full md:w-1/2 lg:w-1/3 p-2 lg:p-5 bg-white rounded">
                        <h3 className="text-3xl font-bold text-center p-2">Forgot Password</h3>
                        <p className="text-center text-gray-500 text-sm my-4">
                            Please provide your email address so we can send you a password reset link
                        </p>
                        <article className=" md:p-2 my-2 w-full ">
                            <label htmlFor="email" className="text-gray-500 text-sm font-semibold">Email</label>
                            <input type="email" id="email" name='email' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
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

                        <article className="text-center p-2 mt-4">
                            <button type='submit' onClick={formik.handleSubmit} className="bg-gray-900 text-white w-52 h-10 rounded text-md font-semibold">
                                {
                                    loading ? (
                                        <span className="animate-spin inline-block rounded-full h-5 w-5 border-x-2 border-white my-auto"></span>
                                    ) : <span >Send Reset Link</span>
                                }</button>
                        </article>

                    </section>
                </form>
            </div>
        </>
    )
}

export default ForgotPassword