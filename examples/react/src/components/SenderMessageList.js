// tag::SMSG-1.1[]
import React from 'react';

export default (props) => {
  const {sendersInfo, getUserName, getTime, getDate, getUserAvatarUrl, styleForMessageSender} = props;
  // end::SMSG-1.1[]

  // tag::SMSG-2.1[]
  return (
    <div className='senderMessageDialog'>
      {/*// end::SMSG-2.1[]*/}
      {/*// tag::SMSG-3[]*/}
      {sendersInfo.map( (m, index) =>
        <li className={styleForMessageSender(m.senderId)} key={index}>
          <div className='messageSentDay'>{getDate(m.timetoken, 'senderMessage')}</div>
          <div className='message'>
            <div className='name'>{getUserName(m.senderId)}</div>
            <div className='time'>{getTime(m.timetoken)}</div>
            <div className='text'>{m.text}</div>
            <img width='28' height='28' alt='Sender avatar' src={getUserAvatarUrl(m.senderId, 'smImage')}/>
          </div>
        </li>
      )}
      {/*// end::SMSG-3[]*/}

      {/*// tag::SMSG-2.2[]*/}
      {/*// end::SMSG-2.2[]*/}
    {/*// tag::SMSG-2.3[]*/}
    </div>
    // end::SMSG-2.3[]
  // tag::SMSG-2.4[]
  );
  // end::SMSG-2.4[]
// tag::SMSG-1.2[]
}
// end::SMSG-1.2[]
