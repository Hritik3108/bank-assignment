import { useDispatch, useSelector } from 'react-redux';
import './transactionPopUp.css';
import { setTransactionVisiblity } from '../../util/visiblitySlice';
import { useState } from 'react';
import Loading from '../loading';
import axios from 'axios';
import { updateUserBalance } from '../../util/userSlice';

const TransactionPopUp = () => {
    const dispatch = useDispatch();

    const popupVisibiltiry = useSelector((store) => store.visiblity.transactionVisiblity);
    const type = useSelector((store) => store.visiblity.transactionType);
    const sessionActive = useSelector((store) => store.user.sessionActive);
    const user = useSelector((store) => sessionActive ? store.user.user : null);
    const token = useSelector((store) => sessionActive ? store.user.token : null);

    const [amount,setAmount] = useState(0)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const config = {
        headers: { 
            'Authorization': `JWT ${token}`,
            'Content-Type': 'application/json' 
        },
        withCredentials: true
    };

    function handleCloseBtn(){
        dispatch(setTransactionVisiblity(!popupVisibiltiry))
    }

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        const bodyparameter={
            amount:parseFloat(amount)
        }
        try {
            const transactionResponse = await axios.post(`/api/${type}`,bodyparameter, config);
            if(transactionResponse.status===200){
                dispatch(updateUserBalance(transactionResponse.data.balance))
                handleCloseBtn();
            }
            setLoading(false);
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.response.data.message);
            setLoading(false);
        }
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={`container d-flex justify-content-center align-items-center ${!popupVisibiltiry?'d-none': 'd-block'}`}>
            <div className='popup card'>
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


            <h3 className="card-header">{sessionActive && (type).toUpperCase()}</h3>
            <div className='card-body'>
                <p className='bal'>Balance: ${user && user.balance}</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="amount" className="form-label fw-bold">Amount:</label>
                    <input 
                        type="number" 
                        name='amount' 
                        id='amount' 
                        className='form-control'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter Amount"
                        required
                    />

                    <input type='submit' value={type} className={`btn w-100 mt-3 ${type=='withdraw'?`btn-danger`:`btn-success`}`}/>
                </form>
                {error && <p className="text-danger mt-2">{error}</p>}
            </div>

            </div>
        </div>
    )
}

export default TransactionPopUp;