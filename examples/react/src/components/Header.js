// tag::HEAD-1.1[]
import React from 'react';
import appLogo from '../styles/avatars/45px/logo.png';
import onlineLogo from '../styles/avatars/45px/onlineUsersLogo.png';

export default (props) => {
    const {userName, profileImage, usersNumber} = props;

    return (
        <div className='header'>
        {/*// end::HEAD-1.1[]*/}
            {/*// tag::HEAD-2[]*/}
            <div className='onlineUsersCount'>
                <img className='onlineUsersLogo' width='45' height='45' alt='logo' src={onlineLogo}/>
                <div className='members'>{usersNumber} members</div>
                <span>Online</span>
                <span className='onlineCircle'/>
            </div>
            {/*// end::HEAD-2[]*/}
            {/*// tag::HEAD-3[]*/}
            <img className='logo' width='45' height='45' alt='logo' src={appLogo}/>
            <h1>Animal Forest</h1>
            <h2>A group to chat with all your fuzzy friends</h2>
            {/*// end::HEAD-3[]*/}
            {/*// tag::HEAD-4[]*/}
            <div className='userName'>
                <span className='hello'>Hello, </span>
                <span className='user'>{userName}</span>
                <img width='45' height='45' alt='profileImage' src={profileImage}/>
            </div>   
            {/*// end::HEAD-4[]*/}
        {/*// tag::HEAD-1.2[]*/}        
        </div>
    );
}

// end::HEAD-1.2[]
