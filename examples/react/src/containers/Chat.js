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
        this.userName = randomUser.firstName + ' the ' + randomUser.lastName;
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
          usersTyping: [],
          historyLoaded: false,
          historyMsgs: [],
          onlineUsers: [],
          onlineUsersNumber: '',
          networkStatus: null
        }
        this.pubnub.init(this);
    }

    getRandomUser = () => {
      return users[Math.floor(Math.random() * users.length)];
    }

    componentWillMount(){
      this.subscribe();

      this.pubnub.getMessage('demo-animal-forest', (m) => {
        console.log(m)
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
        if (presence.action === 'state-change') {
          if (presence.state.isTyping === true) 
            this.addTypingUser(presence.uuid) 
          else 
            this.removeTypingUser(presence.uuid)
        }

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

    setPubnubState = (isTyping) => {
      this.pubnub.setState({
        state: {
          isTyping: isTyping
        },
        channels: ['demo-animal-forest']
      })
    }
    
    
    addTypingUser = (uuid) => {
      const usersTyping = this.state.usersTyping;
      usersTyping.push(uuid);
      this.setState({usersTyping})
    }

    removeTypingUser = (uuid) => {
      var usersTyping = this.state.usersTyping;
      usersTyping = usersTyping.filter(userUUID => userUUID !== uuid)
      this.setState({usersTyping})
    }

    getTime = (timetoken) => {
      const hours = new Date(parseInt(timetoken.substring(0, 13))).getHours();
      const minutes = new Date(parseInt(timetoken.substring(0, 13))).getMinutes();
      return `${hours}:${minutes}`;
    }

    findById = (uuid) => {
      const user = users.find( element => element.uuid === uuid );
      return user.firstName + ' the ' + user.lastName;
    }

    getUserImage = (uuid) => {
      const image = users.find(element => element.uuid === uuid);
      return image.profileImage.smImage;
    }

    render() {
        return (
          <div className='grid'>
              <Header 
                userName={this.userName}
                profileImage={this.profileImage.lgImage}/>                
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
                setPubnubState={this.setPubnubState}
                usersTyping={this.state.usersTyping}
                findById={this.findById}
                networkStatus={this.state.networkStatus}/>
              <OnlineUsers 
                users={users}
                getUserImage={this.getUserImage}
                findById={this.findById}
                onlineUsers={this.state.onlineUsers}
                usersNumber={this.state.onlineUsersNumber}/>
          </div>
        );
    }
}