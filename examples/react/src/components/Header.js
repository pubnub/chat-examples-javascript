import React from 'react';
import logo from '../styles/avatars/45px/logo.png';

const Header = (props) => {
    const {userName, profileImage} = props;

    return (
        <div className='header'>
            <img className='logo' width='45' height='45' alt='logo' src={logo}/>
            <h1 className='title'>Animal Forest</h1>
            <h2>A group to chat with all your fuzzy friends</h2>
            <div className='userName'>Hello, 
                <span>{userName}</span>
                <img width='45' height='45' alt='profileImage' src={profileImage}/>
            </div>
        </div>
    );
}

export default Header;
