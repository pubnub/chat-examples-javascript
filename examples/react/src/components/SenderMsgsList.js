// tag::SMSG-1.1[]
import React from 'react';

export default (props) => {
  const {sendersInfo, findById, getTime, getDate, getUserImage, styleForMessageSender, scrollToBottom} = props;
  // end::SMSG-1.1[]

  // tag::SMSG-2.1[]
  return (
    <div className='senderMsgsDialog'>
      {/*// end::SMSG-2.1[]*/}
      {/*// tag::SMSG-3[]*/}
      {sendersInfo.map( (m, index) =>
        <li className={styleForMessageSender(m.senderId)} key={index}>
          <div className='msgSentDay'>{getDate(m.timetoken, 'senderMsg')}</div>
          <div className='message'>
            <div className='name'>{findById(m.senderId)}</div>
            <div className='time'>{getTime(m.timetoken)}</div>
            <div className='text'>{m.text}</div>
            <img width='28' height='28' alt='' src={getUserImage(m.senderId, 'smImage')}/>
          </div>
        </li>
      )}
      {/*// end::SMSG-3[]*/}

      {/*// tag::SMSG-2.2[]*/}
      {scrollToBottom()}
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
