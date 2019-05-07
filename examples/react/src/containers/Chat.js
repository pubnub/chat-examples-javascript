// tag::CHT-1.1[]
import React, { Component } from 'react';
import PubNubReact from 'pubnub-react';
import OnlineUsers from '../components/OnlineUsers';
import MessageBody from './MessageBody';
import MessagesList from '../components/MessagesList';
import Header from '../components/Header';
import users from '../config/users';
import {publishKey, subscribeKey} from '../config/keys';

import networkErrorImg from '../styles/networkError.png';
 
export default class extends Component {
    constructor(props) {
        super(props);
        const randomUser = this.getRandomUser();
        this.uuid = randomUser.uuid;
        this.designation = randomUser.designation;
        this.userName = randomUser.firstName + ' ' +  randomUser.lastName;
        this.profileImage = randomUser.profileImage.lgImage;
        this.pubnub = new PubNubReact({
            publishKey,    //publishKey: 'Enter your key . . .'
            subscribeKey,  //subscribeKey: 'Enter your key . . .'
            uuid: this.uuid,
            autoNetworkDetection: true,
            restore: true
        });
        this.state = {
          sendersInfo: [],
          lastMsgTimetoken: '',
          historyLoaded: false,
          historyMsgs: [],
          usersTyping: [],
          onlineUsers: [],
          onlineUsersNumber: '',
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
  
    removeTypingUser = (uuid) => {
      var usersTyping = this.state.usersTyping;
      usersTyping = usersTyping.filter(userUUID => userUUID !== uuid);
      this.setState({usersTyping})
    };
    // end::CHT-2.1[]

    // tag::CHT-4[]
    componentWillMount(){           
      const networkError = new Image();
      networkError.src = networkErrorImg;
      this.setState({networkErrorImg: networkError});

      this.subscribe();

      this.pubnub.getMessage('demo-animal-forest', (m) => {
        const time = this.getTime(m.timetoken);
        const sendersInfo = this.state.sendersInfo;
        sendersInfo.push({
          senderId: m.message.senderId,
          text: m.message.text,
          time,
        });
        this.removeTypingUser(this.uuid);
        
        this.setState({
          sendersInfo,
          lastMsgTimetoken: m.timetoken
        });
      });

      this.pubnub.getPresence('demo-animal-forest', (presence) => {
        this.pubnub.hereNow({
          channels: ['demo-animal-forest'],
          includeUUIDs: true,
          includeState: true
        }, (status, response) => {
          this.setState({
            onlineUsers: response.channels['demo-animal-forest'].occupants,
            onlineUsersNumber: response.channels['demo-animal-forest'].occupancy});
        });
      });

      this.pubnub.getStatus((status) => {
        if (status.category === 'PNNetworkDownCategory') 
            this.setState({networkErrorStatus: true});
        if (status.category === 'PNNetworkUpCategory'){
            this.setState({networkErrorStatus: false});
            this.pubnub.reconnect();      
        }
      });

      this.pubnub.history({
        channel: 'demo-animal-forest',
        reverse: false, 
        count: 100,
        stringifiedTimeToken: true
        }, (status, response) => {
          this.setState({
            historyLoaded: true,
            historyMsgs: response.messages,
          });
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
        channels: ['demo-animal-forest'],
        withPresence: true
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

    findById = (uuid) => {
      const user = users.find( element => element.uuid === uuid );
      return user.firstName + ' ' + user.lastName;
    };

    getUserDesignation = (uuid) => {
      const designation = users.find(element => element.uuid === uuid);
      return designation.designation;
    };

    getUserImage = (uuid, size) => {
      const image = users.find(element => element.uuid === uuid);
      return image.profileImage[size];
    };
    // end::CHT-2.2[]

    // tag::CHT-6[]
    render() {
        return (
          <div className='grid'>
              <Header 
                userName={this.userName}
                profileImage={this.profileImage}
                usersNumber={this.state.onlineUsersNumber}/>                
              <MessagesList 
                uuid={this.uuid}
                sendersInfo={this.state.sendersInfo}
                findById={this.findById}
                getUserImage={this.getUserImage}
                getTime={this.getTime}
                historyLoaded={this.state.historyLoaded}
                historyMsgs={this.state.historyMsgs}
                networkErrorStatus={this.state.networkErrorStatus}
                networkErrorImg = {this.state.networkErrorImg}/>
              <MessageBody 
                uuid={this.uuid}
                pubnub={this.pubnub}
                findById={this.findById}/>
              <OnlineUsers 
                users={users}
                getUserImage={this.getUserImage}
                logedUser={this.uuid}
                findById={this.findById}
                getUserDesignation={this.getUserDesignation}
                onlineUsers={this.state.onlineUsers}/>
          </div>
        );
    }
    // end::CHT-6[]
// tag::CHT-1.2[]
}
// end::CHT-1.2[]