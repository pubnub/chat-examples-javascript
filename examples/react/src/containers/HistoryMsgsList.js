import React, {Component} from 'react';

class HistoryMsgsList extends Component {

    shouldComponentUpdate(nextProps) {
        return (this.props.historyMsgs !== nextProps.historyMsgs)
    }    
    
    render() {
        const {historyMsgs, historyLoaded, networkErrorImg, networkErrorStatus,
             findById, getTime, getDate, getUserImage, styleForMessageSender} = this.props;
             
        return (
            <div>
                {networkErrorStatus && networkErrorImg ? (
                    <img referrerPolicy="no-referrer-when-downgrade" className='networkErrorImg' alt='Network error' src={networkErrorImg.src}/> 
                ) : historyLoaded &&                
                <div> 
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
                </div>
                }
            </div>           
        );
    }
}

export default HistoryMsgsList;
