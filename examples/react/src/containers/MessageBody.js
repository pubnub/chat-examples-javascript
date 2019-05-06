import React, {Component} from 'react';
import emojiIcon from '../styles/emojis/emojiIcon.png';
import emojis from '../config/emojis';

class MessageBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msgContent: '',
            emojisWindowState: false
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
            channel: 'demo-animal-forest'
        });
    
        this.setState({
            msgContent: '',
            emojisWindowState: false
        })
    }

    emojisWindowState = (state) => {
        this.setState({
            emojisWindowState: state
        })
    }

    addEmoji = (code) => {
        this.setState({
            msgContent: this.state.msgContent + String.fromCodePoint(code)
        })
    }
         
    render() {
        return (
            <div className='messageBody'>   
                <form className='msgForm'>
                    <input 
                        className='msgInput' 
                        value={this.state.msgContent} 
                        onChange={this.onChange}
                        placeholder='Type your message here . . .'/>
                    <img onClick={() => this.emojisWindowState(true)} className='emojiIcon' width='25' height='25' alt='emojiIcon' src={emojiIcon}/> 
                    <button className='submitBtn' onClick={this.onSubmit} type='submit'>Send</button>

                    {this.state.emojisWindowState && <div className='emojisWindow'>
                        {emojis.map((e, index) => <span key={index}>
                            <img 
                                className='emoji'
                                onClick={() => this.addEmoji(e.code)} 
                                width='28' 
                                height='28' 
                                alt='emoji' 
                                src={e.emoji}/>
                        </span>)}
                        <button className='closeBtn' onClick={() => this.emojisWindowState(false)}>X Close</button>
                    </div>}
                </form>
            </div>
        );
    }
}

export default MessageBody;
