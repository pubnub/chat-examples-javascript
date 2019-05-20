// tag::MSGS-1.1[]
import React from 'react';
import SenderMsgsList from './SenderMsgsList';
import HistoryMsgsList from '../containers/HistoryMsgsList';

export default (props) => {
  const {uuid, sendersInfo, getTime, historyLoaded, historyMsgs, findById,
    getUserImage, networkErrorStatus, networkErrorImg, scrollToBottom, msgsSentDate, getDate} = props;
  // end::MSGS-1.1[]

  // tag::MSGS-2[]
  const styleForMessageSender = senderId => uuid === senderId ? 'senderMsg' : senderId;
  // end::MSGS-2[]

  // tag::MSGS-3.1[]
  return (
    <div className='messageList'>
      {msgsSentDate.length > 0 &&
        <ul className='msgsDialog'>
          {/*// end::MSGS-3.1[]*/}
          {/*// tag::MSGS-4[]*/}
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
          {/*// end::MSGS-4[]*/}
          {/*// tag::MSGS-5[]*/}
          <SenderMsgsList
            sendersInfo={sendersInfo}
            getDate={getDate}
            findById={findById}
            getTime={getTime}
            getUserImage={getUserImage}
            styleForMessageSender={styleForMessageSender}
            scrollToBottom={scrollToBottom}/>
          {/*// end::MSGS-5[]*/}
        {/*// tag::MSGS-3.2[]*/}
        </ul>
        // end::MSGS-3.2[]
      // tag::MSGS-3.3[]
      }
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
