import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';
import AdminSidebar from '../layout/AdminSidebar';
import { getTransactions } from '../../actions/bookingAction';
import { toast } from 'react-hot-toast'

const TransactionList = ({ setBgImage }) => {

    const dispatch = useDispatch();

    const { loading, user } = useSelector(state => state.authState);
    const { transactions = [], error: transactionError } = useSelector(state => state.bookingState);

    const [transactionList, setTransactionList] = useState(transactions);

    // function to sortAscending amount
    const sortAscendingAmount = () => {
        const sortedTransactions = [...transactionList].sort((a, b) => a.amount - b.amount);
        setTransactionList(sortedTransactions);
    }

    // function to sortDescending amount
    const sortDescendingAmount = () => {
        const sortedTransactions = [...transactionList].sort((a, b) => b.amount - a.amount);
        setTransactionList(sortedTransactions);
    }

    // function to filter list by date
    const filterByDate = (date) => {
        if (date) {
            const filteredTransactions = transactions.filter(transaction => new Date(transaction.payment_date).toLocaleDateString() === new Date(date).toLocaleDateString());
            setTransactionList(filteredTransactions);
        } else {
            setTransactionList(transactions);
        }
    }

    // function to filter list by status
    const filterByStatus = (status) => {
        if (status) {
            const filteredTransactions = transactions.filter(transaction => transaction.status.toLowerCase() === status.toLowerCase());
            setTransactionList(filteredTransactions);
        } else {
            setTransactionList(transactions);
        }
    }

    useEffect(() => {
        setTransactionList(transactions);
    }, [transactions]);

    useEffect(() => {
        if (transactionError) {
            toast.error(error);
        }
    }, [transactionError]);

    useEffect(() => {
        setBgImage("bg-white");
        dispatch(getTransactions)
    }, []);

    return (
        <>
            <MetaData title={"Admin Dashboard"} />
            {
                loading ? <Loader /> : (

                    <main className='flex'>
                        <AdminSidebar />

                        {/* <!-- main content --> */}
                        <div className="w-full lg:w-5/6 mx-auto bg-white p-2 md:p-8 rounded-lg shadow-md">

                            <div className=" w-full bg-blue-950 p-3 text-center mb-8 text-white px-6">
                                <h2 className="text-xl font-bold ">Transactions List</h2>
                            </div>

                            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">

                                {/* <!-- Filter and Sort Section --> */}
                                <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center">
                                    <div className="flex flex-wrap gap-4">
                                        {/* <!-- Filter by Status --> */}
                                        <div className="w-full md:w-fit">
                                            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Filter by
                                                Status</label>
                                            <select id="status-filter" onChange={(e) => filterByStatus(e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                                <option value="">All</option>
                                                <option value="Success">Success</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Failed">Failed</option>
                                            </select>
                                        </div>
                                        {/* <!-- Filter by Date --> */}
                                        <div className="w-full md:w-fit">
                                            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700">Filter by
                                                Date</label>
                                            <input type="date" id="date-filter" onChange={(e) => filterByDate(e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
                                        </div>
                                    </div>
                                    {/* <!-- Sort by Amount --> */}
                                    <div className="mt-4 md:mt-0">
                                        <label className="block text-sm font-medium text-gray-700 text-center">Sort by Amount</label>
                                        <div className="flex">
                                            <button onClick={sortAscendingAmount}
                                                className="flex text-blue-600 p-2 font-bold hover:text-blue-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto font-bold mx-2">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="m4.5 18.75 7.5-7.5 7.5 7.5" />
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="m4.5 12.75 7.5-7.5 7.5 7.5" />
                                                </svg>
                                                <span>Ascending</span>
                                            </button>
                                            <button onClick={sortDescendingAmount}
                                                className="flex text-blue-600 p-2 font-bold hover:text-blue-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    strokeWidth="1.5" stroke="currentColor" className="size-4 my-auto font-bold mx-2">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                                </svg>
                                                <span>Decending</span>
                                            </button>
                                        </div>

                                    </div>
                                </div>
                                <div className="border-t border-gray-200"></div>
                                <h3 className='p-2 ps-7 text-gray-600 font-bold text-lg'>{transactionList?.length} data found.</h3>

                                {/* <!-- Transactions Table --> */}
                                <div className="md:px-6 py-4">
                                    <div className="overflow-x-auto">
                                        <table id="transactions-table" className="min-w-full bg-white">
                                            <thead className="bg-gray-800 text-white">
                                                <tr>
                                                    <th className="py-2 px-4 border-b text-left">Transaction ID</th>
                                                    <th className="py-2 px-4 border-b text-left">Booking ID</th>
                                                    <th className="py-2 px-4 border-b text-left">Date</th>
                                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                                    <th className="py-2 px-4 border-b text-left">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    transactionList?.length > 0 ? (
                                                        transactionList.map((trans, index) => {

                                                            const date = new Date(trans?.payment_date).toLocaleDateString();

                                                            return <tr key={index}>
                                                                <td className="py-2 px-4 border-b">{trans?.transaction_id}</td>
                                                                <td className="py-2 px-4 border-b">{trans?.booking_id?.booking_id}</td>
                                                                <td className="py-2 px-4 border-b">{date}</td>
                                                                <td>
                                                                    <span className={`rounded py-0.5 px-2 border-b ${trans?.status === 'Pending'
                                                                        ? 'bg-yellow-200 text-yellow-800'
                                                                        : trans?.status === 'Success'
                                                                            ? 'bg-green-200 text-green-800'
                                                                            : trans?.status === 'Failed'
                                                                                ? 'bg-red-200 text-red-800'
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        {trans?.status}
                                                                    </span>
                                                                </td>

                                                                <td className="py-2 px-4 border-b">&#8377;{trans?.amount.toFixed(2)}</td>
                                                            </tr>
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={5} className="py-2 px-4 border-b text-center">No data found</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div >
                    </main >
                )
            }
        </>
    )
}

export default TransactionList