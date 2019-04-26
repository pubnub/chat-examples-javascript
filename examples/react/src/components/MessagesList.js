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
    
    const scrollToBottom = () => {
        if(document.querySelector(".msgsDialog"))
            document.querySelector(".msgsDialog").scrollTo(0, document.querySelector(".msgsDialog").scrollHeight);
    }
    
    return (
        <div className='messageList'> 
        {/* {console.log('render') } */}
            {historyLoaded && 
                <ul className='msgsDialog'>
                {historyMsgs.map( m =>
                    <li className={m.entry.senderId} key={m.timetoken}>
                        {styleSenderMsg(m.entry.senderId)}
                        <div className='name'>{findById(m.entry.senderId)}</div>
                        <div className='time'>{getTime(m.timetoken)}</div>
                        <div className='message'>{m.entry.text}</div> 
                        <img width='28' height='28' alt='' src={getUserImage(m.entry.senderId)}/>        
                    </li>)}
                {sendersInfo.map( (m, index) =>
                    <li className={m.senderId} key={index}>
                        {styleSenderMsg(m.senderId)}
                        <div className='name'>{findById(m.senderId)}</div>
                        <div className='time'>{m.time}</div>
                        <div className='message'>{m.text}</div> 
                        <img width='28' height='28' alt='' src={m.profileImage}/>         
                    </li>)}

                {scrollToBottom()}
                </ul>}
        </div>
    );
}

export default MessageList;

