import React from 'react';

const OnlineUsers = (props) => {
    const {findById, onlineUsers, usersNumber, getUserImage} = props;
    
    return (
        <div className='onlineUsers'>
            <div className='onlineUsersCount'>{usersNumber} member(s) <span>Online:</span></div>
                <ul className='onlineUsersList'>
                  {onlineUsers.map((user, index) => 
                    <li key={index}>
                        <div className='name'>{findById(user.uuid)}</div>
                        <img width='45' height='45' alt='' src={getUserImage(user.uuid)}/>
                    </li>)}                 
                </ul>
        </div>
    );
}

export default OnlineUsers;
