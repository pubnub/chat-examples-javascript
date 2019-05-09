import React from 'react';

const MessageList = (props) => { 
    const {uuid, sendersInfo, getTime, historyLoaded, historyMsgs, findById, getUserImage,getDate, networkErrorStatus, networkErrorImg} = props;
    const styleForMessageSender = senderId => uuid === senderId ? 'senderMsg' : senderId;
    
    const scrollToBottom = () => {
        const elem = document.querySelector(".msgsDialog");

        if(elem) {
            elem.scrollTop = elem.scrollHeight;
        }
    };
    
    return (
        <div className='messageList'> 
            {networkErrorStatus && networkErrorImg ? <img referrerPolicy="no-referrer-when-downgrade" className='networkErrorImg' alt='Network error' src={networkErrorImg.src}/> : 
            historyLoaded && 
                <ul className='msgsDialog'>
                {historyMsgs.map( (m, index) =>
                    <li className={styleForMessageSender(m.entry.senderId)} key={m.timetoken}>
                        <div className='msgSentDay'>{getDate(m.timetoken, 'historyMsg', index)}</div>
                        <div className='message'>
                            <div className='name'>{findById(m.entry.senderId)}</div>
                            <div className='time'>{getTime(m.timetoken)}</div>
                            <div className='text'>{m.entry.text}</div> 
                            <img width='28' height='28' alt='' src={getUserImage(m.entry.senderId, 'smImage')}/>            
                        </div>
                    </li>)}
                {sendersInfo.map( (m, index) =>
                    <li className={styleForMessageSender(m.senderId)} key={index}>
                        <div className='msgSentDay'><span>{getDate(m.timetoken, 'senderMsg')}</span></div>
                        <div className='message'>
                            <div className='name'>{findById(m.senderId)}</div>
                            <div className='time'>{getTime(m.timetoken)}</div>
                            <div className='text'>{m.text}</div> 
                            <img width='28' height='28' alt='' src={getUserImage(m.senderId, 'smImage')}/>         
                        </div>
                    </li>)}

                {scrollToBottom()}
                </ul>
            }
        </div>
    );
}

export default MessageList;

