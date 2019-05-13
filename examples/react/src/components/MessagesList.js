// tag::MSGS-1.1[]
import React from 'react';
import SenderMsgsList from './SenderMsgsList';
import HistoryMsgsList from '../containers/HistoryMsgsList';

export default (props) => { 
<<<<<<< HEAD
    const {uuid, sendersInfo, getTime, historyLoaded, historyMsgs, findById,
         getUserImage, networkErrorStatus, networkErrorImg, scrollToBottom, msgsSentDate, getDate} = props;
    // end::MSGS-1.1[]
    
    // tag::MSGS-2[]

    const styleForMessageSender = senderId => uuid === senderId ? 'senderMsg' : senderId;
    // end::MSGS-2[]

    return (
        <div className='messageList'>
        {msgsSentDate.length > 0 && 
            <ul className='msgsDialog'> 
                <HistoryMsgsList
                    historyMsgs={historyMsgs}
                    historyLoaded={historyLoaded}
                    networkErrorImg={networkErrorImg}
                    networkErrorStatus={networkErrorStatus}
                    getDate={getDate}
                    findById={findById}
                    getTime={getTime}
                    getUserImage={getUserImage}
                    styleForMessageSender={styleForMessageSender}/>
                <SenderMsgsList 
                    sendersInfo={sendersInfo}
                    getDate={getDate}
                    findById={findById}
                    getTime={getTime}
                    getUserImage={getUserImage}
                    styleForMessageSender={styleForMessageSender}
                    scrollToBottom={scrollToBottom}/>
            </ul>}
           {/* // tag::MSGS-4.4[] */}
            
            {/*// end::MSGS-4.4[]*/}
        {/*// tag::MSGS-4.5[]*/}
        </div>
        // end::MSGS-4.5[]
     // tag::MSGS-4.6[]
    );
    // end::MSGS-4.6[]
   // tag::MSGS-1.2[]
=======
  const {uuid, sendersInfo, getTime, historyLoaded, historyMsgs, findById,
    getUserImage,getDate, networkErrorStatus, networkErrorImg, scrollToBottom} = props;
  // end::MSGS-1.1[]

  // tag::MSGS-2[]
  const styleForMessageSender = senderId => uuid === senderId ? 'senderMsg' : senderId;
  // end::MSGS-2[]
    
  // tag::MSGS-3.1[]
  return (
    <div className='messageList'> 
      {networkErrorStatus && networkErrorImg ? (
        <img referrerPolicy="no-referrer-when-downgrade" className='networkErrorImg' alt='Network error' src={networkErrorImg.src}/> 
      ) : (historyLoaded && 
        <ul className='msgsDialog'>
          {/*// end::MSGS-3.1[]*/}
          {/*// tag::MSGS-4[]*/}
          {historyMsgs.map( (m, index) =>
            <li className={styleForMessageSender(m.entry.senderId)} key={m.timetoken}>
              <div className='msgSentDay'>{getDate(m.timetoken, 'historyMsg', index)}</div>
              <div className='message'>
                <div className='name'>{findById(m.entry.senderId)}</div>
                <div className='time'>{getTime(m.timetoken)}</div>
                <div className='text'>{m.entry.text}</div> 
                <img width='28' height='28' alt='' src={getUserImage(m.entry.senderId, 'smImage')}/>            
              </div>
            </li>
          )}
          {/*// end::MSGS-4[]*/}
          {/*// tag::MSGS-5[]*/}
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
          {/*// end::MSGS-5[]*/}

          {/*// tag::MSGS-3.2[]*/}
          {scrollToBottom()}
          {/*// end::MSGS-3.2[]*/}
        {/*// tag::MSGS-3.3[]*/}
        </ul>
        // end::MSGS-3.3[]
      // tag::MSGS-3.4[]
      )}
      {/*// end::MSGS-3.4[]*/}
    {/*// tag::MSGS-3.5[]*/}
    </div>
    // end::MSGS-3.5[]
  // tag::MSGS-3.6[]
  );
  // end::MSGS-3.6[]
// tag::MSGS-1.2[]
>>>>>>> 86e9a25be3d80748067888b258ea9f7583460894
}
// end::MSGS-1.2[]
