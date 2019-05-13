// tag::HMSG-1.1[]
import React, {Component} from 'react';

export default class HistoryMsgsList extends Component {
  // end::HMSG-1.1[]
  // tag::HMSG-2[]
  shouldComponentUpdate(nextProps) {
    return (this.props.historyMsgs !== nextProps.historyMsgs)
  }
  // end::HMSG-2[]

  // tag::HMSG-1.2[]
  render() {
    const {historyMsgs, historyLoaded, networkErrorImg, networkErrorStatus,
      findById, getTime, getDate, getUserImage, styleForMessageSender} = this.props;
    // end::HMSG-1.2[]

    // tag::HMSG-3.1[]
    return (
      <div>
        {networkErrorStatus && networkErrorImg ? (
          <img referrerPolicy="no-referrer-when-downgrade" className='networkErrorImg' alt='Network error' src={networkErrorImg.src}/>
        ) : (historyLoaded &&
          <div>
            {/*// end::HMSG-3.1[]*/}
            {/*// tag::HMSG-4[]*/}
            {historyMsgs.map( (m, index) =>
              <li className={styleForMessageSender(m.entry.senderId)} key={m.timetoken}>
                <div className='msgSentDay'>{getDate(m.timetoken, 'historyMsg', index)}</div>
                <div className='message'>
                  <div className='name'>{findById(m.entry.senderId)}</div>
                  <div className='time'>{getTime(m.timetoken)}</div>
                  <div className='text'>{m.entry.text}</div>
                  <img width='28' height='28' alt='' src={getUserImage(m.entry.senderId, 'smImage')}/>
                </div>
              </li>
            )}
          {/*// end::HMSG-4[]*/}
          {/*// tag::HMSG-3.2[]*/}
          </div>
          // end::HMSG-3.2[]
        // tag::HMSG-3.3[]
        )}
        {/*// end::HMSG-3.3[]*/}
      {/*// tag::HMSG-3.4[]*/}
      </div>
      // end::HMSG-3.4[]
      // tag::HMSG-3.5[]
    );
    // end::HMSG-3.5[]
  // tag::HMSG-1.3[]
  }
}
// end::HMSG-1.3[]
