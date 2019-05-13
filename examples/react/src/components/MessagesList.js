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
}
// end::MSGS-1.2[]
