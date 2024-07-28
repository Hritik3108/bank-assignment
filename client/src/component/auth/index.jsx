import axios from 'axios';
import { useState,useRef, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';

import './auth.css'
import Loading from '../loading/index'
import { addUser } from '../../util/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile  } from '@fortawesome/free-regular-svg-icons';
import { faUser  } from '@fortawesome/free-solid-svg-icons';

const Auth = () => {
    const dispatch = useDispatch();

    const [isSignUp, setIsSignUp] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');  

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUserName] = useState("");
    const [role,setRole] = useState("")
    
    const [profilePicture, setProfilePicture] = useState();
    const [profilePicturePreview, setProfilePicturePreview] = useState();

    const navigate = useNavigate();
    const formRef = useRef();

function handleSubmit(e) {
    e.preventDefault();
        !isSignUp ? register() : login();
}

async function register() {
    console.log('register');
    setLoading(true);
    
    const config = {
        headers: { 
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
    };

    const formData = new FormData();
    {profilePicture!==undefined && formData.append('file', profilePicture)};
    formData.append('email',email)
    formData.append('username',username)
    formData.append('password',password)
    formData.append('role',role)
     
    try {
        const registerResponse = await axios.post(`/api/register`, formData, config);
        if(registerResponse.status==200){
            setLoading(false);
            dispatch(addUser(registerResponse.data));

            // console.log(registerResponse.data);
            navigate('/home');
        }else{
            setError('Something Went wrong.');
            setLoading(false);
        }
    } catch (error) {
        console.error("Error while register:", error.message);
        setError('Something Went wrong.');
        setLoading(false);
    }
}

async function login() {
    setLoading(true);

    const config = {
        headers: { 
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    };

    const formData = new FormData();
    formData.append('email',email)
    formData.append('password',password)

    try {
        const loginResponse = await axios.post(`/api/login`, formData, config);
        if(loginResponse.status==200){
            setLoading(false);
            dispatch(addUser(loginResponse.data));
            // console.log('login',loginResponse.data);

            navigate('/home');
        }else{
            setError('Something Went wrong.');
            setLoading(false);
        }
    } catch (error) {
        console.error("Error while login:", error.message);
        setError('Something Went wrong.');
        setLoading(false);
    }
}  



function handlePicture(e){
    const file = e.target.files[0];
    setProfilePicture(file);
    const reader = new FileReader();
    reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
    };
    reader.readAsDataURL(file);
}

if (loading) {
    return <Loading />;
}


    return (
        <div className='auth d-flex justify-content-center align-items-center '>
            <div className='container-fluid auth-container'>
                <div className="row">
                    <div className="col-12 col-md-6 logo-col d-flex flex-column align-items-center justify-content-center">
                        <span className='ms-4 p-1 logo-text'>En Pointe Bank</span>
                        <FontAwesomeIcon id='logo-icon' className='smile-icon fa-fw' icon={faSmile} />
                    </div>

                    <div className="form-col col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <form className="auth-form" ref={formRef} onSubmit={handleSubmit}>
                        {isSignUp ? <h2>Login</h2> : <h2>Register</h2>}
                        {!isSignUp && (
                            <div className="profile-photo-group">
                                
                                <label htmlFor="profilePicture" className="label-cls">
                                    {!profilePicture && (
                                        <FontAwesomeIcon id='profile-picture-icon' className='profile-picture-icon fa-fw' icon={faUser} />
                                    )}

                                    {profilePicture && (
                                    <img
                                        src={profilePicturePreview}
                                        className='profile-img'
                                        alt="Profile Preview"
                                    />
                                    )}
                                </label>
                                <input
                                    type="file"
                                    id="profilePicture"
                                    name="profilePicture"
                                    className="profilePicture invisible"
                                    onChange={handlePicture}
                                />
                            </div>
                        )}
                        
                        {!isSignUp && (
                            <div className="name-group">
                                <input
                                    type="text"
                                    id="username"
                                    name='username'
                                    value={username}
                                    className="form-control"
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="User Name"
                                    required
                                />
                            </div>
                        )}
                        
                        <div className="email-group mt-3">
                            <input
                                type="email"
                                id="email"
                                name='email'
                                value={email}
                                className="form-control"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                            />
                        </div>
                        
                        <div className="password-group mt-3">
                            <input
                                type="password"
                                id="password"
                                name='password'
                                value={password}
                                className="form-control"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                        </div>

                        {!isSignUp && (
                            <div className="role-group mt-3">
                                <select
                                id="role"
                                name='role'
                                value={role}
                                className="form-control"
                                onChange={(e)=>setRole(e.target.value)}
                                required
                                >
                                <option value="">Select Role</option>
                                <option value="banker">Banker</option>
                                <option value="customer">customer</option>
                                </select>
                            </div>
                        )}

                        <button type="submit" className='btn btn-dark mt-3'>{isSignUp ? 'Login' : 'Register'}</button>
                        {error && <span className="error m-3">{error}</span>}
                        
                        <div className="form-bottom-div text-center mt-2">
                            {isSignUp ? (
                                <div>
                                    Not registered?{" "}
                                    <a
                                        className="not-registered"
                                        onClick={() => setIsSignUp(false)}
                                    >
                                        Create account
                                    </a>
                                </div>
                            ) : (
                                <div>
                                    Already registered?{" "}
                                    <a
                                        className="not-registered"
                                        onClick={() => setIsSignUp(true)}
                                    >
                                        Login
                                    </a>
                                </div>
                            )}
                        </div>

                    </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Auth;