import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../loading';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../util/userSlice';
import handleImageSource from "../../util/handleImageSource";

const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sessionActive = useSelector((store) => store.user.sessionActive);
    const user = useSelector((store) => sessionActive ? store.user.user : null);
    const token = useSelector((store) => sessionActive ? store.user.token : null);

    function handleLogout() {
        dispatch(logoutUser());
        navigate('/');
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <span className="home-heading">
                    {user && (
                        <span className="d-flex profile-desc">
                            <img 
                                src={user.pp ? handleImageSource(user.pp) : ''} 
                                alt='Profile image' 
                                className='profile-image rounded-circle me-2'
                                width="62" 
                                height="62"  
                            />
                            <button className="btn username" onClick={()=>navigate('/home')}>{user && user.username}</button>
                            <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
                        </span>
                    )}
                </span>
        </>
    )
}

export default Header;