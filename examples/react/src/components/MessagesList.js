import React from 'react';

const MessageList = (props) => {
    const [sendersInfo, getTime, historyLoaded, historyMsgs, findNameOutOfId] = 
            [props.sendersInfo, props.getTime, props.historyLoaded, props.historyMsgs, props.findNameOutOfId];

    return (
        <div>
            {historyLoaded && 
                <ul>
                {historyMsgs.map( m =>
                    <li key={m.timetoken}>
                        {findNameOutOfId(m.entry.senderId)}: {m.entry.text} /  {getTime(m.timetoken)}          
                    </li>)}
                {sendersInfo.map( (m, index) => 
                    <li key={index}>
                        {findNameOutOfId(m.senderId)}: {m.text} /  {m.time}          
                    </li>)}
                </ul>}
        </div>
    );
}

export default MessageList;

