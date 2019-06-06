// tag::HEAD-1.1[]
import React from 'react';
import appLogo from '../styles/avatars/45px/logo.png';
import onlineUsersLogo from '../styles/avatars/45px/onlineUsersLogo.png';

export default (props) => {
  const {userName, userProfileImage, onlineUsersCount} = props;

  return (
    <div className='header'>
    {/*// end::HEAD-1.1[]*/}
      {/*// tag::HEAD-2[]*/}
      <div className='onlineUsersInfo'>
        <img className='onlineUsersLogo' width='45' height='45' alt='Online users logo' src={onlineUsersLogo}/>
        <div className='onlineUsersCount'>{onlineUsersCount} members</div>
        <span>Online</span>
        <span className='onlineIndicator'/>
      </div>
      {/*// end::HEAD-2[]*/}
      {/*// tag::HEAD-3[]*/}
      <img className='appLogo' width='45' height='45' alt='App logo' src={appLogo}/>
      <h1>Animal Forest</h1>
      <h2>A group to chat with all your fuzzy friends</h2>
      {/*// end::HEAD-3[]*/}
      {/*// tag::HEAD-4[]*/}
      <div className='loggedInUser'>
        <div className='userWelcome'>
          <span className='hello'>Hello, </span>
          <span className='user'>{userName}</span>
        </div>
        <img width='45' height='45' alt='Logged In User Avatar' src={userProfileImage}/>
      </div>
      {/*// end::HEAD-4[]*/}
    {/*// tag::HEAD-1.2[]*/}
    </div>
  );
}
// end::HEAD-1.2[]
