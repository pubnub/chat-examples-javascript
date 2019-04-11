import React from 'react';

const MessageList = (props) => { 
    const {sendersInfo, getTime, historyLoaded, historyMsgs, findById} = props;

    return (
        <div>
            {historyLoaded && 
                <ul>
                {historyMsgs.map( m =>
                    <li key={m.timetoken}>
                        {findById(m.entry.senderId)}: {m.entry.text} /  {getTime(m.timetoken)}          
                    </li>)}
                {sendersInfo.map( (m, index) => 
                    <li key={index}>
                        {findById(m.senderId)}: {m.text} /  {m.time}          
                    </li>)}
                </ul>}
            <br/>
        </div>
    );
}

export default MessageList;

