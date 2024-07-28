import React from "react";
import './home.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import axios from "axios";
import Loading from '../loading';
import { useNavigate } from 'react-router-dom';

import formatDateString from "../../util/formatDateString";
import Header from "../header";
import { setTransactionType, setTransactionVisiblity } from "../../util/visiblitySlice";
import handleImageSource from "../../util/handleImageSource";


function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bankerError, setBankerError] = useState(null);
    const [transactions,setTransactions] = useState([])
    const [accounts,setAccounts] = useState([])

    const sessionActive = useSelector((store) => store.user.sessionActive);
    const user = useSelector((store) => sessionActive ? store.user.user : null);
    const token = useSelector((store) => sessionActive ? store.user.token : null);

    const config = {
        headers: { 
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json' 
        },
        withCredentials: true
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactionResponse = await axios.get("/api/transactions", config);
                setTransactions(transactionResponse.data);
                // if(transactionResponse.status===200){
                //     console.log('transaction response', transactionResponse.data);
                // }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error.message);
                setError("Error fetching transactions");
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const accountResponse = await axios.get("/api/accounts", config);
                setAccounts(accountResponse.data);
                // console.log('accounts response', accountResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error.message);
                setBankerError("Error fetching transactions");
                setLoading(false);
            }
        };

        if(user && user.role=='banker'){
            fetchAccounts();
        }
    }, [token]);

    function handleClickOnAccount(id) {
        navigate(`/customer?id=${id}`);
    }

    const popupVisibiltiry = useSelector((store) => store.visiblity.transactionVisiblity);

    function handleWithdraw(){
        dispatch(setTransactionType('withdraw'));
        dispatch(setTransactionVisiblity(!popupVisibiltiry))
    }

    function handleDeposit(){
        dispatch(setTransactionType('deposit'));
        dispatch(setTransactionVisiblity(!popupVisibiltiry))
    }

    if (loading) {
        return <Loading />;
    }

    if(user && user.role=='banker'){
        return(
            <div className="dashboard">
                <Header/>
            {/* <h1 className="text-center mx-auto mb-4">Customers</h1> */}

            <div className="row mt-5">
                    <div className='container-fluid table-container'>
                        <div className='row'>
                            <div className='col-12'>
                                <h2 className='text-center'>Customers</h2>
                                <div className="table-responsive">
                                    <table className='table table-striped table-bordered'>
                                        <thead>
                                            <tr className="table-heading bg-warning">
                                                <th>Profile Picture</th>
                                                <th>Customer Id</th>
                                                <th>Email</th>
                                                <th>Username</th>
                                                <th>balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(accounts) && accounts.slice().reverse().map((customer) => (
                                                <tr key={customer._id} onClick={() => handleClickOnAccount(customer._id)} >
                                                    <td>
                                                        <img 
                                                            src={customer.pp ? handleImageSource(customer.pp) : ''} 
                                                            alt='customer image' 
                                                            className='table-image' 
                                                            onClick={() => handleClickOnAccount(customer._id)} 
                                                        />
                                                    </td>
                                                    <td>{customer._id}</td>
                                                    <td>{customer.email}</td>
                                                    <td>{customer.username}</td>
                                                    <td>{customer.balance}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
            {bankerError && <div className="error-message">{bankerError}</div>} 
            </div>
        )

    }else{

        return (
            <div className="dashboard">
                <Header/>
                {/* <h1 className="text-center mx-auto mb-4">Dashboard</h1> */}
                <div className="row mt-5">
                    <div className="col-lg-4 col-md-6 mb-4">
                        <div className={`card text-white ${user?(user.balance<=0?`bg-danger`:`bg-success`):`bg-danger`}`}>
                            <div className="card-header">Acc No. {user && user._id}</div>
                            <div className="card-body">
                                <h5 className="card-title">$ {user && user.balance}</h5>
                                <p className="card-text">Available Balance</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">
                        <button className="btn btn-danger w-100 transaction-btn" onClick={()=>handleWithdraw()}>Withdraw</button>
                    </div>

                    <div className="col-lg-4 col-md-6 mb-4">
                        <button className="btn btn-success w-100 transaction-btn" onClick={()=>handleDeposit()}>Deposit</button>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className='container-fluid table-container'>
                        <div className='row'>
                            <div className='col-12'>
                                <h2 className='text-center my-4'>Transactions</h2>
                                <div className="table-responsive">
                                    <table className='table table-striped table-bordered'>
                                        <thead>
                                            <tr className="table-heading bg-warning">
                                                <th>Transaction Id</th>
                                                <th>type</th>
                                                <th>amount</th>
                                                <th>date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(transactions) && transactions.slice().reverse().map((transaction) => (
                                                <tr key={transaction._id}>
                                                    <td>{transaction._id}</td>
                                                    <td>{transaction.type}</td>
                                                    <td>$ {transaction.amount}</td>
                                                    <td>{formatDateString(transaction.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                

                {error && <div className="error-message">{error}</div>} 
                 
            </div>
        );
    }    
}

export default Home;