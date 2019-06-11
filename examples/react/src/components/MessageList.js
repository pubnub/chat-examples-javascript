// tag::MSGS-1.1[]
import React from 'react';
import SenderMessageList from './SenderMessageList';
import HistoryMessageList from '../containers/HistoryMessageList';

export default (props) => {
  const {uuid, sendersInfo, getTime, historyLoaded, historyMessages, getUserName,
    getUserAvatarUrl, networkErrorStatus, networkErrorImg, messageSentDate, getDate} = props;
  // end::MSGS-1.1[]

  // tag::MSGS-2[]
  const styleForMessageSender = senderId => uuid === senderId ? 'senderMessage' : senderId;
  // end::MSGS-2[]

  // tag::MSGS-3.1[]
  return (
    <div className='messageList'>
        <ul className='messageDialog'>
          {/*// end::MSGS-3.1[]*/}
          {/*// tag::MSGS-4[]*/}
        {messageSentDate.length > 0 &&
          <HistoryMessageList
            historyMessages={historyMessages}
            historyLoaded={historyLoaded}
            networkErrorImg={networkErrorImg}
            networkErrorStatus={networkErrorStatus}
            getDate={getDate}
            getUserName={getUserName}
            getTime={getTime}
            getUserAvatarUrl={getUserAvatarUrl}
            styleForMessageSender={styleForMessageSender}/>
        }
          {/*// end::MSGS-4[]*/}
          {/*// tag::MSGS-5[]*/}
          <SenderMessageList
            sendersInfo={sendersInfo}
            getDate={getDate}
            getUserName={getUserName}
            getTime={getTime}
            getUserAvatarUrl={getUserAvatarUrl}
            styleForMessageSender={styleForMessageSender}/>
          {/*// end::MSGS-5[]*/}
        {/*// tag::MSGS-3.2[]*/}
        </ul>
        {/* // end::MSGS-3.2[] */}
      {/* // tag::MSGS-3.3[] */}
      {/*// end::MSGS-3.3[]*/}
    {/*// tag::MSGS-3.4[]*/}
    </div>
    // end::MSGS-3.4[]
  // tag::MSGS-3.5[]
  );
  // end::MSGS-3.5[]
// tag::MSGS-1.2[]
}
// end::MSGS-1.2[]
