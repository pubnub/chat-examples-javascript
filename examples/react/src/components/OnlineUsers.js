import React from 'react';

const OnlineUsers = (props) => {
    const {logedUser, findById, onlineUsers, getUserImage, getUserDesignation} = props;

    const putLogedUserFirst = (arr) => {  
        if(arr.length) {
            const logedUserIndex = arr.map(elem => elem.uuid).indexOf(logedUser);
            if(logedUserIndex !== -1) {
                [arr[0], arr[logedUserIndex]] = [arr[logedUserIndex], arr[0]];
            }
        }    
    }
    
    return (
        <div className='onlineUsers'>
        {putLogedUserFirst(onlineUsers)}
            <ul className='onlineUsersList'>
                {onlineUsers.map((user, index) => 
                <li key={index}>
                    <div className='name'>{findById(user.uuid)}</div>
                    <div className='designation'>{getUserDesignation(user.uuid)}</div>
                    <img width='45' height='45' alt='onlineUser' src={getUserImage(user.uuid)}/>
                    
                    {user.uuid === logedUser && <div className='logedUser'>(You)</div>}
                </li>)}                 
            </ul>
        </div>
    );
}

export default OnlineUsers;
