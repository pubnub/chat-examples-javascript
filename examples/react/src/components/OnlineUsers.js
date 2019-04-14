import React from 'react';

const OnlineUsers = (props) => {
    const {findById, onlineUsers, usersNumber} = props;
    
    return (
        <div>
            {usersNumber} member(s) online:
                <ul>
                  {onlineUsers.map((user, index) => 
                    <li key={index}>
                        {findById(user.uuid)}
                    </li>)}                 
                </ul>
        </div>
    );
}

export default OnlineUsers;
