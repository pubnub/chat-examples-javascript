// tag::CHT-1.1[]
import React, { Component } from 'react';
import PubNubReact from 'pubnub-react';
import OnlineUsers from '../components/OnlineUsers';
import MessageBody from './MessageBody';
import MessageList from '../components/MessageList';
import Header from '../components/Header';
import users from '../config/users';
import {publishKey, subscribeKey} from '../config/keys';
import {forestChatChannel} from '../config/chat';

import networkErrorImg from '../styles/networkError.png';
 
export default class extends Component {
  constructor(props) {
    super(props);
    const randomUser = this.getRandomUser();
    this.uuid = randomUser.uuid;
    this.designation = randomUser.designation;
    this.userName = randomUser.firstName + ' ' +  randomUser.lastName;
    this.userProfileImage = randomUser.profileImage.lgImage;
    this.pubnub = new PubNubReact({
      publishKey,    //publishKey: 'Enter your key . . .'
      subscribeKey,  //subscribeKey: 'Enter your key . . .'
      uuid: this.uuid,
      autoNetworkDetection: true,
      restore: true,
    });
    this.state = {
      sendersInfo: [],
      lastMessageWeekday: '',
      messageSentDate: [],
      historyLoaded: false,
      historyMessages: [],
      onlineUsers: [],
      onlineUsersCount: '',
      networkErrorStatus: false,
      networkErrorImg: null
    };
    this.pubnub.init(this);
  }
  // end::CHT-1.1[]

  // tag::CHT-2.1[]
  getRandomUser = () => {
    return users[Math.floor(Math.random() * users.length)];
  };
  // end::CHT-2.1[]

  // tag::CHT-4[]
  componentWillMount() {
    const networkError = new Image();
    networkError.src = networkErrorImg;
    this.setState({networkErrorImg: networkError});

    this.subscribe();

    this.pubnub.getPresence(forestChatChannel, (presence) => {
      if (presence.action === 'join') {
        let users = this.state.onlineUsers;

        users.push({
          state: presence.state,
          uuid: presence.uuid
        });

        this.setState({
          onlineUsers: users,
          onlineUsersCount: this.state.onlineUsersCount + 1
        });
      }

      if ((presence.action === 'leave') || (presence.action === 'timeout')) {
        let leftUsers = this.state.onlineUsers.filter(users => users.uuid !== presence.uuid);

        this.setState({
          onlineUsers: leftUsers,
        });
   
        const length = this.state.onlineUsers.length;
        this.setState({
          onlineUsersCount: length
        });
      }

      if (presence.action === 'interval') {
        if (presence.join || presence.leave || presence.timeout) {
          let onlineUsers = this.state.onlineUsers;
          let onlineUsersCount = this.state.onlineUsersCount;
 
          if (presence.join) {
            presence.join.map(user => (
              user !== this.uuid &&
              onlineUsers.push({
                state: presence.state,
                uuid: user
              })
            ));

            onlineUsersCount += presence.join.length;
          }

          if (presence.leave) {
            presence.leave.map(leftUser => onlineUsers.splice(onlineUsers.indexOf(leftUser), 1));
            onlineUsersCount -= presence.leave.length;
          }

          if (presence.timeout) {
            presence.timeout.map(timeoutUser => onlineUsers.splice(onlineUsers.indexOf(timeoutUser), 1));
            onlineUsersCount -= presence.timeout.length;
          }

          this.setState({
            onlineUsers,
            onlineUsersCount
          });
        }
      }
    });

    this.pubnub.getStatus((status) => {
      if (status.category === 'PNConnectedCategory') {
        this.hereNow();

        this.pubnub.history({
          channel: forestChatChannel,
          count:25,
          reverse: false,
          stringifiedTimeToken: true
        }, (status, response) => {
          const lastMessageWeekday = this.getWeekday(response.endTimeToken);

          this.setState({
            historyLoaded: true,
            historyMessages: response.messages,
            lastMessageWeekday
          });

          let messageSentDate = this.state.historyMessages.map(message => this.getWeekday(message.timetoken));
          this.setState({messageSentDate});
          this.scrollToBottom();
        });
      }
                 
      if (status.category === 'PNNetworkDownCategory') {
        this.setState({networkErrorStatus: true});
      }

      if (status.category === 'PNNetworkUpCategory') {
        this.setState({networkErrorStatus: false});
        this.pubnub.reconnect();
        this.scrollToBottom();
      }
    });

    this.pubnub.getMessage(forestChatChannel, (m) => {
      const sendersInfo = this.state.sendersInfo;
      
      sendersInfo.push({
        senderId: m.message.senderId,
        text: m.message.text,
        timetoken: m.timetoken,
      });
      
      this.setState(this.state);

      const lastMessageWeekday = this.getWeekday(m.timetoken);
      this.setState({
        sendersInfo,
        lastMessageWeekday
      });

      this.scrollToBottom();
    });

    window.addEventListener('beforeunload', this.leaveChat);
  }
  // end::CHT-4[]

  // tag::CHT-5[]
  componentWillUnmount() {
    this.leaveChat();
  }
  // end::CHT-5[]

  // tag::CHT-3[]
  subscribe = () => {
    this.pubnub.subscribe({
      channels: [forestChatChannel],
      withPresence: true
    });
  };

  hereNow = () => {
    this.pubnub.hereNow({
      channels: [forestChatChannel],
      includeUUIDs: true,
      includeState: false
    }, (status, response) => {
      this.setState({
        onlineUsers: response.channels[forestChatChannel].occupants,
        onlineUsersCount: response.channels[forestChatChannel].occupancy
      });
    });
  };

  leaveChat = () => {
    this.pubnub.unsubscribeAll();
  };
  // end::CHT-3[]

  // tag::CHT-2.2[]
  getTime = (timetoken) => {
    return new Date(parseInt(timetoken.substring(0, 13))).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })
  };

  getDate = (timetoken, messageType, index = 0) => {
    const messageWeekday = this.getWeekday(timetoken);
    const date = new Date(parseInt(timetoken.substring(0, 13))).toLocaleDateString('en-US', {day: 'numeric', month: 'long'});
    
    switch (messageType) {
      case 'historyMessage':
        if (this.state.messageSentDate[index - 1] !== messageWeekday) {
          return `${date}, ${messageWeekday}`; 
        }
        
        break;
      case 'senderMessage':
        if (this.state.lastMessageWeekday !== messageWeekday) {
          return `${date}, ${messageWeekday}`;
        }
        
        break;
      default:
        return;
    }
  };
    
  getWeekday = (timetoken) => {
    return new Date(parseInt(timetoken.substring(0, 13))).toLocaleDateString('en-US', {weekday: 'long'});
  };

  
  getUser = (uuid) => {
    return users.find( element => element.uuid === uuid);
  };
  
  getUserName = (uuid) => {
    const user = this.getUser(uuid);
  
    if (user) {
      return user.firstName + ' ' + user.lastName;
    }
  };

  getUserDesignation = (uuid) => {
    const user = this.getUser(uuid);
  
    if (user) {
      return user.designation;
    }
  };

  getUserAvatarUrl = (uuid, size) => {
    const user = this.getUser(uuid);
  
    if (user) {
        return user.profileImage[size];
    }
  };

  scrollToBottom = () => {
    const elem = document.querySelector(".messageDialog");

    if(elem) {
        elem.scrollTop = elem.scrollHeight;
    }
  };
  // end::CHT-2.2[]

  // tag::CHT-6[]
  render() {
    return (
      <div className='grid'>
        <Header 
          userName={this.userName}
          userProfileImage={this.userProfileImage}
          onlineUsersCount={this.state.onlineUsersCount}/>                
        <MessageList 
          uuid={this.uuid}
          sendersInfo={this.state.sendersInfo}
          getUserName={this.getUserName}
          getUserAvatarUrl={this.getUserAvatarUrl}
          getTime={this.getTime}
          messageSentDate={this.state.messageSentDate}
          getDate={this.getDate}
          historyLoaded={this.state.historyLoaded}
          historyMessages={this.state.historyMessages}
          networkErrorStatus={this.state.networkErrorStatus}
          networkErrorImg={this.state.networkErrorImg}/>
        <MessageBody 
          uuid={this.uuid}
          pubnub={this.pubnub}
          chatName={forestChatChannel}/>
        <OnlineUsers 
          users={users}
          getUserAvatarUrl={this.getUserAvatarUrl}
          loggedInUser={this.uuid}
          getUserName={this.getUserName}
          getUserDesignation={this.getUserDesignation}
          onlineUsers={this.state.onlineUsers}/>
        </div>
      );
  }
  // end::CHT-6[]
// tag::CHT-1.2[]
}
// end::CHT-1.2[]
