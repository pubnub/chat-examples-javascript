// tag::ONLN-1.1[]
import React from 'react';

export default (props) => {
  const {logedUser, findById, onlineUsers, getUserImage, getUserDesignation} = props;
  // end::ONLN-1.1[]
  
  // tag::ONLN-2[]
  const putLogedUserFirst = (arr) => { 
    if(arr.length) {
      const logedUserIndex = arr.map(elem => elem.uuid).indexOf(logedUser);
      
      if(logedUserIndex !== -1) {
        [arr[0], arr[logedUserIndex]] = [arr[logedUserIndex], arr[0]];
      }
    }    
  };
  // end::ONLN-2[]

  // tag::ONLN-3.1[]  
  return (
    <div className='onlineUsers'>
      {putLogedUserFirst(onlineUsers)}
      {/*// end::ONLN-3.1[]*/}
      {/*// tag::ONLN-4[]*/}
      <ul className='onlineUsersList'>
        {onlineUsers.map((user, index) => 
          <li key={index}>
            <div className='name'>{findById(user.uuid)}
              {user.uuid === logedUser && <div className='youSign'>(You)</div>}                   
            </div>
            <div className='designation'>{getUserDesignation(user.uuid)}</div>
            <img width='45' height='45' alt='onlineUser' src={getUserImage(user.uuid, 'lgImage')}/>                  
          </li>
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
