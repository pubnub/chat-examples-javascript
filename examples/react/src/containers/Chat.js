import React, { Component } from 'react';
import PubNubReact from 'pubnub-react';
import OnlineUsers from '../components/OnlineUsers';
import MessageBody from '../components/MessageBody';
import MessagesList from '../components/MessagesList';
import Header from '../components/Header';
import users from '../config/users';
import {publishKey, subscribeKey} from '../config/keys';
 
export default class extends Component {
    constructor(props) {
        super(props);
        const randomUser = this.getRandomUser();
        this.uuid = randomUser.uuid;
        this.userName = randomUser.firstName + ' the ' + randomUser.lastName;
        this.pubnub = new PubNubReact({
            publishKey,    //publishKey: 'Enter your key . . .'
            subscribeKey,  //subscribeKey: 'Enter your key . . .'
            uuid: this.uuid
        });
        this.state = {
          msgContent: '',
          sendersInfo: [],
          historyLoaded: false,
          historyMsgs: [],
          onlineUsers: [],
          onlineUsersNumber: ''
        }
        this.pubnub.init(this);
    }

    getRandomUser = () => {
      return users[Math.floor(Math.random() * users.length)];
    }

    componentWillMount() {
      this.pubnub.subscribe({
            channels: ['demo-animal-chat'],
            withPresence: true
      });

      this.pubnub.getMessage('demo-animal-chat', (m) => {
        const time = this.getTime(m.timetoken);
        const sendersInfo = this.state.sendersInfo;
        sendersInfo.push({
          senderId: m.message.senderId,
          text: m.message.text,
          time
        });
        this.setState({sendersInfo});
      });

      this.pubnub.getPresence('demo-animal-chat', () => {
          this.pubnub.hereNow({
            channels: ['demo-animal-chat'],
            includeUUIDs: true,
            includeState: true
          }, (status, response) => {
            this.setState({
              onlineUsers: response.channels['demo-animal-chat'].occupants,
              onlineUsersNumber: response.channels['demo-animal-chat'].occupancy});
          });
      });

      this.pubnub.history({
        channel: 'demo-animal-chat',
        reverse: false, 
        count: 100,
        stringifiedTimeToken: true
        }, (status, response) => {
          this.setState({
            historyLoaded: true,
            historyMsgs: response.messages
          });
      });

      window.addEventListener('beforeunload', this.leaveChat);
    }
    
    componentWillUnmount() {
      this.leaveChat();
    }

    leaveChat = () => {
      this.pubnub.unsubscribe({
        channels: ['demo-animal-chat']
      });
    }

    getTime = (timetoken) => {
      const hours = new Date(parseInt(timetoken.substring(0, 13))).getHours();
      const minutes = new Date(parseInt(timetoken.substring(0, 13))).getMinutes();
      return `${hours}:${minutes}`;
    }

    findNameOutOfId = (uuid) => {
      const user = users.find( element => element.uuid === uuid );
      return user.firstName + ' the ' + user.lastName;
    }

    onChange = (e) => {
      this.setState({
        msgContent: e.target.value
      });
    }

    onSubmit = async (e) => {
      e.preventDefault();
      this.state.msgContent.length &&
      this.pubnub.publish({
        message: {
          senderId: this.uuid,
          text: this.state.msgContent,
        },
        channel: 'demo-animal-chat',
      });
      this.setState({
        msgContent: '',
      })
    }
 
    render() {
        return (
          <div>
              <Header userName={this.userName}/>                
              <MessagesList 
                sendersInfo={this.state.sendersInfo}
                findNameOutOfId={this.findNameOutOfId}
                getTime={this.getTime}
                historyLoaded={this.state.historyLoaded}
                historyMsgs={this.state.historyMsgs}/>
              <MessageBody 
                msgContent={this.state.msgContent}
                onChange={this.onChange}
                onSubmit={this.onSubmit}/>
              <OnlineUsers 
                users={users}
                findNameOutOfId={this.findNameOutOfId}
                onlineUsers={this.state.onlineUsers}
                usersNumber={this.state.onlineUsersNumber}/>
          </div>
        );
    }
}