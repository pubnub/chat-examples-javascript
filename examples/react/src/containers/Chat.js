import React, { Component } from 'react';
import PubNubReact from 'pubnub-react';
import OnlineUsers from '../components/OnlineUsers';
import MessageBody from './MessageBody';
import MessagesList from '../components/MessagesList';
import Header from '../components/Header';
import users from '../config/users';
import {publishKey, subscribeKey} from '../config/keys';
 
export default class extends Component {
    constructor(props) {
        super(props);
        const randomUser = this.getRandomUser();
        this.uuid = randomUser.uuid;
        this.designation = randomUser.designation;
        this.userName = randomUser.firstName + ' ' +  randomUser.lastName;
        this.profileImage = randomUser.profileImage;
        this.pubnub = new PubNubReact({
            publishKey,    //publishKey: 'Enter your key . . .'
            subscribeKey,  //subscribeKey: 'Enter your key . . .'
            uuid: this.uuid,
            autoNetworkDetection: true,
        });
        this.state = {
          sendersInfo: [],
          lastMsgTimetoken: '',
          historyLoaded: false,
          historyMsgs: [],
          usersTyping: [],
          onlineUsers: [],
          onlineUsersNumber: '',
          networkStatus: null
        }
        this.pubnub.init(this);
    }

    getRandomUser = () => {
      return users[Math.floor(Math.random() * users.length)];
    }
  
    removeTypingUser = (uuid) => {
      var usersTyping = this.state.usersTyping;
      usersTyping = usersTyping.filter(userUUID => userUUID !== uuid)
      this.setState({usersTyping})
    }

    componentWillMount(){
      this.subscribe();

      this.pubnub.getMessage('demo-animal-forest', (m) => {
        const time = this.getTime(m.timetoken);
        const sendersInfo = this.state.sendersInfo;
        sendersInfo.push({
          senderId: m.message.senderId,
          text: m.message.text,
          time,
          profileImage: m.userMetadata.profileImage.smImage
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
          this.setState({networkStatus: 'It looks like you have a problem with your network :('});
        if (status.category === 'PNNetworkUpCategory') {
          this.setState({networkStatus: null})
          this.subscribe(this.state.lastMsgTimetoken);
        }       
      });

      this.pubnub.history({
        channel: 'demo-animal-forest',
        reverse: false, 
        count: 10,
        stringifiedTimeToken: true
        }, (status, response) => {
          this.setState({
            historyLoaded: true,
            historyMsgs: response.messages,
          });
      });

      window.addEventListener('beforeunload', this.leaveChat);
    }
    
    componentWillUnmount() {
      this.leaveChat();
    }

    subscribe = (timetoken = 0) => {
      this.pubnub.subscribe({
        channels: ['demo-animal-forest'],
        withPresence: true,
        timetoken: timetoken
      });
    }

    leaveChat = () => {
      this.pubnub.unsubscribeAll();
    }

    getTime = (timetoken) => {
      return new Date(parseInt(timetoken.substring(0, 13))).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })
    }

    findById = (uuid) => {
      const user = users.find( element => element.uuid === uuid );
      return user.firstName + ' ' + user.lastName;
    }

    getUserDesignation = (uuid) => {
      const designation = users.find(element => element.uuid === uuid);
      return designation.designation;
    }

    getUserImage = (uuid) => {
      const image = users.find(element => element.uuid === uuid);
      return image.profileImage.lgImage;
    }

    render() {
        return (
          <div className='grid'>
              <Header 
                userName={this.userName}
                profileImage={this.profileImage.lgImage}
                usersNumber={this.state.onlineUsersNumber}/>                
              <MessagesList 
                uuid={this.uuid}
                sendersInfo={this.state.sendersInfo}
                findById={this.findById}
                getUserImage={this.getUserImage}
                getTime={this.getTime}
                historyLoaded={this.state.historyLoaded}
                historyMsgs={this.state.historyMsgs}/>
              <MessageBody 
                uuid={this.uuid}
                profileImage={this.profileImage}
                pubnub={this.pubnub}
                findById={this.findById}
                networkStatus={this.state.networkStatus}/>
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
}