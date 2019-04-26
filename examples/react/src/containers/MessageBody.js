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
    
        this.setState({
            msgContent: '',
        })
    }

     
    render() {
        const {networkStatus} = this.props;
        return (
            <div className='messageBody'>    
                <form className='msgForm'>
                    <input 
                        className='msgInput' 
                        value={this.state.msgContent} 
                        onChange={this.onChange}
                        placeholder='Message . . .'/>
                    <button className='submitBtn' onClick={this.onSubmit} type='submit'>Send</button>
                </form>

                {networkStatus}
            </div>
        );
    }
}

export default MessageBody;
