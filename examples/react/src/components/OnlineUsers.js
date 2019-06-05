// tag::ONLN-1.1[]
import React from 'react';
import User from './User';

export default (props) => {
  const {loggedInUser, getUserName, onlineUsers, getUserAvatarUrl, getUserDesignation} = props;
  // end::ONLN-1.1[]
  
  // tag::ONLN-2[]
  const putLoggedInUserFirst = (arr) => { 
    if(arr.length) {
      const loggedInUserIndex = arr.map(elem => elem.uuid).indexOf(loggedInUser);
      
      if(loggedInUserIndex !== -1) {
        [arr[0], arr[loggedInUserIndex]] = [arr[loggedInUserIndex], arr[0]];
      }
    }    
  };
  // end::ONLN-2[]

  // tag::ONLN-3.1[]  
  return (
    <div className='onlineUsers'>
      {putLoggedInUserFirst(onlineUsers)}
      {/*// end::ONLN-3.1[]*/}
      {/*// tag::ONLN-4[]*/}
      <ul className='onlineUserList'>
        {onlineUsers.map((user, index) => 
          <User
            key={index}
            user={user}
            getUserName={getUserName}
            loggedInUser={loggedInUser}
            getUserDesignation={getUserDesignation}
            getUserAvatarUrl={getUserAvatarUrl}/>
        )}                 
      </ul>
      {/*// end::ONLN-4[]*/}
    {/*// tag::ONLN-3.2[]*/}
    </div>
    // end::ONLN-3.2[]
  // tag::ONLN-3.3[]
  );
  // end::ONLN-3.3[]
// tag::ONLN-1.2[]
}
// end::ONLN-1.2[]
