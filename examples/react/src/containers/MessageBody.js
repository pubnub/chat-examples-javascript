import React, {Component} from 'react';

class MessageBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msgContent: '',
        }
    }
    
    onChange = (e) => {
        this.setState({
            msgContent: e.target.value,
        });

        const {timeout} = this;

        if (timeout)
            clearTimeout(timeout);
        else
            this.props.setPubnubState(true);
  
        this.timeout = setTimeout(() => {
            this.props.setPubnubState(false);
            this.timeout = undefined;
        }, 1000)
    }
  
    onSubmit = (e) => {
        e.preventDefault();
        this.state.msgContent.length &&
        this.props.pubnub.publish({
            message: {
            senderId: this.props.uuid,
            text: this.state.msgContent,
            },
            channel: 'demo-animal-forest',
            meta: {
                "profileImage": this.props.profileImage
            }
        });

        this.props.setPubnubState(false);
    
        this.setState({
            msgContent: '',
        })
    }

     
    render() {
        const {networkStatus} = this.props;
        return (
            <div className='messageBody'>
                {/* <ul> //typing indicators
                    {usersTyping.length > 0  &&
                        usersTyping.map((user, index) => 
                            <li key={index}>{findById(user)} is typing . . .</li>
                        )}
                </ul> */}
    
                <form className='msgForm'>
                    <input 
                        className='msgInput' 
                        value={this.state.msgContent} 
                        onChange={this.onChange}
                        placeholder='Message . . .'/>
                    <button className='submitBtn' onClick={this.onSubmit} type='submit'>Send</button>
                </form>

                {networkStatus}

                <br/><br/>
            </div>
        );
    }
}

export default MessageBody;
