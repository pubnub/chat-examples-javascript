import React from 'react';

const MessageList = (props) => { 
    const {uuid, sendersInfo, getTime, historyLoaded, historyMsgs, findById, getUserImage} = props;

    const styleSenderMsg = (senderId) => {
        if (uuid === senderId) {
            var senderMsgs = document.getElementsByClassName(senderId);
            if (senderMsgs.length) {
                var arr = [].slice.call(senderMsgs);
                arr.map(e => e.className = 'senderMsg'); 
            }
        }
    }

    return (
        <div className='messageList'>
            {historyLoaded && 
                <ul className='msgsDialog'>
                {historyMsgs.map( m =>
                    <li className={m.entry.senderId} key={m.timetoken}>
                        {styleSenderMsg(m.entry.senderId)}
                        <div className='name_time'>{findById(m.entry.senderId)}, {getTime(m.timetoken)}</div>
                        <div className='message'>{m.entry.text}</div> 
                        <img width='28' height='28' alt='' src={getUserImage(m.entry.senderId)}/>        
                    </li>)}
                {sendersInfo.map( (m, index) =>
                    <li className={m.senderId} key={index}>
                        {styleSenderMsg(m.senderId)}
                        <div className='name_time'>{findById(m.senderId)}, {m.time}</div>
                        <div className='message'>{m.text}</div> 
                        <img width='28' height='28' alt='' src={m.profileImage}/>         
                    </li>)}
                </ul>}
            <br/>
        </div>
    );
}

export default MessageList;

