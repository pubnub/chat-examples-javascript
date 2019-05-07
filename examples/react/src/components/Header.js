import React from 'react';
import appLogo from '../styles/avatars/45px/logo.png';
import onlineLogo from '../styles/avatars/45px/onlineUsersLogo.png';

const Header = (props) => {
    const {userName, profileImage, usersNumber} = props;

    return (
        <div className='header'>
            <div className='onlineUsersCount'>
                <img className='onlineUsersLogo' width='45' height='45' alt='logo' src={onlineLogo}/>
                <div className='members'>{usersNumber} members</div>
                <span>Online</span>
                <span className='onlineCircle'></span>
            </div>
            <img className='logo' width='45' height='45' alt='logo' src={appLogo}/>
            <h1>Animal Forest</h1>
            <h2>A group to chat with all your fuzzy friends</h2>
            <div className='userName'>Hello, 
                <span>{userName}</span>
                <img width='45' height='45' alt='profileImage' src={profileImage}/>
            </div>           
        </div>
    );
}

export default Header;
