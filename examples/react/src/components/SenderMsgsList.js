import React from 'react';

const SenderMsgsList = (props) => {
    const {sendersInfo, findById, getTime, getDate, getUserImage, styleForMessageSender, scrollToBottom} = props;
    
    return (
        <div className='senderMsgsDialog'>
            {sendersInfo.map( (m, index) =>
            <li className={styleForMessageSender(m.senderId)} key={index}>
            {console.log('renderam sender msgs')}
                <div className='msgSentDay'>{getDate(m.timetoken, 'senderMsg')}</div>
                <div className='message'>
                    <div className='name'>{findById(m.senderId)}</div>
                    <div className='time'>{getTime(m.timetoken)}</div>
                    <div className='text'>{m.text}</div> 
                    <img width='28' height='28' alt='' src={getUserImage(m.senderId, 'smImage')}/>         
                </div>
            </li>)}

        {scrollToBottom()}
        </div>
    );
}

export default SenderMsgsList;
