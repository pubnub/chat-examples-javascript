import React from 'react';

const MessageList = (props) => { 
    const {uuid, sendersInfo, getTime, historyLoaded, historyMsgs, findById, getUserImage, networkErrorStatus, networkErrorImg} = props;

    const styleSenderMsg = (senderId) => {
        if (uuid === senderId) {
            var senderMsgs = document.getElementsByClassName(senderId);
            if (senderMsgs.length) {
                var arr = [].slice.call(senderMsgs);
                arr.map(e => e.className = 'senderMsg'); 
            }
        }
    }
    
    const scrollToBottom = () => {
        if(document.querySelector(".msgsDialog")) {
            const elem = document.querySelector(".msgsDialog");
            elem.scrollTop = elem.scrollHeight;
        }
    }
    
    return (
        <div className='messageList'> 
        {console.log('u mess list/NEI')}
            {networkErrorStatus && networkErrorImg ? <img referrerPolicy="no-referrer-when-downgrade" className='networkErrorImg' alt='Network error' src={networkErrorImg.src}/> : 
            historyLoaded && 
                <ul className='msgsDialog'>
                {historyMsgs.map( m =>
                    <li className={m.entry.senderId} key={m.timetoken}>
                        {styleSenderMsg(m.entry.senderId)}
                        <div className='name'>{findById(m.entry.senderId)}</div>
                        <div className='time'>{getTime(m.timetoken)}</div>
                        <div className='message'>{m.entry.text}</div> 
                        <img width='28' height='28' alt='' src={getUserImage(m.entry.senderId, 'smImage')}/>        
                    </li>)}
                {sendersInfo.map( (m, index) =>
                    <li className={m.senderId} key={index}>
                        {styleSenderMsg(m.senderId)}
                        <div className='name'>{findById(m.senderId)}</div>
                        <div className='time'>{m.time}</div>
                        <div className='message'>{m.text}</div> 
                        <img width='28' height='28' alt='' src={getUserImage(m.senderId, 'smImage')}/>         
                    </li>)}

                {scrollToBottom()}
                </ul>
            }
        </div>
    );
}

export default MessageList;

