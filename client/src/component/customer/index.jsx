import './customer.css'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import Loading from '../loading';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from '../header';
import formatDateString from "../../util/formatDateString";
import handleImageSource from "../../util/handleImageSource";

const Customer = () => {
    const dispatch = useDispatch();
    const popupVisibiltiry = useSelector((store) => store.visiblity.transactionVisiblity);

    const navigate = useNavigate();
    const location = useLocation();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [customer,setCustomer] = useState();
    const [customerTransaction,setCustomerTransaction] =  useState();

    const sessionActive = useSelector((store) => store.user.sessionActive);
    const user = useSelector((store) => sessionActive ? store.user.user : null);
    const token = useSelector((store) => sessionActive ? store.user.token : null);

    const params = new URLSearchParams(location.search);
    const id = params.get('id');

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
                const customerTransactionResponse = await axios.get(`/api/transactions/${id}`, config);
                setCustomerTransaction(customerTransactionResponse.data);
                // console.log('transaction response', customerTransactionResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error.message);
                setError("Error fetching transactions");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customerResponse = await axios.get(`/api/customer/${id}`, config);
                setCustomer(customerResponse.data);
                // console.log('customer response', customerResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error.message);
                setError("Error fetching customer");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    function handleCloseBtn(){
        navigate('/home')
    }

    if (loading) {
        return <Loading />;
    }

    return (
        
        <div className="dashboard">
                <Header/>
                <button
                    type="button"
                    className="close-btn align-items-center justify-content-center"
                    onClick={handleCloseBtn}
                >
                    <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                </button>
            <h1 className="text-center mx-auto mb-4">Customers</h1>
            
            <div className="row mt-5">
                <div className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center align-items-center">
                    <img 
                        src={customer && customer.pp ? handleImageSource(customer.pp) : ''} 
                        alt='Profile image' 
                        className='profile-image cus-profile rounded-circle me-2'
                        width="200" 
                        height="200"  
                    />
                </div>

                <div className="col-lg-4 col-md-6 mb-4">
                    {/* <strong>UserName:</strong> {customer && customer.username} <br />
                    <strong>Email:</strong> {customer && customer.email} */}
                    <div className={`card text-white bg-info`}>
                        <div className="card-header">Details</div>
                        <div className="card-body">
                            <h6 className="card-title">Username: {customer && customer.username}</h6>
                            {/* <h6 className="card-title">Email: {customer && customer.email}</h6> */}
                            <p className="card-text">Email: {customer && customer.email}</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 mb-4">
                    <div className={`card text-white ${customer?(customer.balance<=0?`bg-danger`:`bg-success`):`bg-danger`}`}>
                        <div className="card-header">Acc No. {customer && customer._id}</div>
                        <div className="card-body">
                            <h5 className="card-title">$ {customer ? customer.balance : '0'}</h5>
                            <p className="card-text">Available Balance</p>
                        </div>
                    </div>
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
                                            {customerTransaction && customerTransaction.slice().reverse().map((transaction) => (
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
        
    )
}

export default Customer;