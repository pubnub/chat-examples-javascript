// tag::HMSG-1.1[]
import React, {Component} from 'react';

export default class HistoryMesageList extends Component {
  // end::HMSG-1.1[]
  // tag::HMSG-2[]
  shouldComponentUpdate(nextProps) {
    return (this.props.historyMessage !== nextProps.historyMessage)
  }
  // end::HMSG-2[]

  // tag::HMSG-1.2[]
  render() {
    const {historyMessage, historyLoaded, networkErrorImg, networkErrorStatus,
      getUserName, getTime, getDate, getUserImage} = this.props;
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
            {historyMessage.map( (m, index) =>
              <li key={m.timetoken}>
                <div className='messageSentDay'>{getDate(m.timetoken, 'historyMessage', index)}</div>
                <div className='message'>
                  <div className='name'>{getUserName(m.entry.senderId)}</div>
                  <div className='time'>{getTime(m.timetoken)}</div>
                  <div className='text'>{m.entry.text}</div>
                  <img width='28' height='28' alt='Sender logo' src={getUserImage(m.entry.senderId, 'smImage')}/>
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
