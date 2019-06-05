import React from 'react';

export default (props) => {
    const {user, getUserName, loggedInUser, getUserDesignation, getUserAvatarUrl} = props;

    return (
        <li>
            <div className='userName'>{getUserName(user.uuid)}
                {user.uuid === loggedInUser && <div className='youSign'>(You)</div>}                   
            </div>
            <div className='designation'>{getUserDesignation(user.uuid)}</div>
            <img width='45' height='45' alt='Online users' src={getUserAvatarUrl(user.uuid, 'lgImage')}/>                  
        </li>
    );
}

