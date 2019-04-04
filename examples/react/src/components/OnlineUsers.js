import React from 'react';

const OnlineUsers = (props) => {
    const [findNameOutOfId, onlineUsers, usersNumber] = 
            [props.findNameOutOfId, props.onlineUsers, props.usersNumber];
    
    return (
        <div>
            {usersNumber} member(s) online:
                <ul>
                  {onlineUsers.map((user, index) => 
                    <li key={index}>
                        {findNameOutOfId(user.uuid)}
                    </li>)}                 
                </ul>
        </div>
    );
}

export default OnlineUsers;
