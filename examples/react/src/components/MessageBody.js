// tag::MSGB-1.1[]
import React, {Component} from 'react';
import emojiIcon from '../styles/emojis/emojiIcon.png';
import emojis from '../config/emojis';

export default class MessageBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msgContent: '',
            emojisWindowState: false
        }
    }
    // end::MSGB-1.1[]
    
    // tag::MSGB-2[]
    onChange = (e) => {
        this.setState({
            msgContent: e.target.value,
        });
    };
    // end::MSGB-2[]
  
    // tag::MSGB-3[]
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
    };
    // end::MSGB-3[]

    // tag::MSGB-4[]
    emojisWindowState = (state) => {
        this.setState({
            emojisWindowState: state
        })
    };

    addEmoji = (code) => {
        this.setState({
            msgContent: this.state.msgContent + String.fromCodePoint(code)
        })
    };
    // end::MSGB-4[]
         
    // tag::MSGB-5.1[]
    render() {
        return (
            <div className='messageBody'>   
                <form className='msgForm'>
                {/*// end::MSGB-5.1[]*/}
                    {/*// tag::MSGB-6[]*/}
                    <input 
                        className='msgInput' 
                        value={this.state.msgContent} 
                        onChange={this.onChange}
                        placeholder='Type your message here . . .'/>
                    <img onClick={() => this.emojisWindowState(true)} className='emojiIcon' width='25' height='25' alt='emojiIcon' src={emojiIcon}/> 
                    <button className='submitBtn' onClick={this.onSubmit} type='submit'>Send</button>
                    {/*// end::MSGB-6[]*/}

                    {/*// tag::MSGB-7[]*/}
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
                    {/*// end::MSGB-7[]*/}
                {/*// tag::MSGB-5.2[]*/}
                </form>
                {/*// end::MSGB-5.2[]*/}
            {/*// tag::MSGB-5.3[]*/}
            </div>
            // end::MSGB-5.3[]
        // tag::MSGB-5.4[]
        );
        // end::MSGB-5.4[]
    // tag::MSGB-5.5[]
    }
    // end::MSGB-5.5[]
// tag::MSGB-1.2[]
}

// end::MSGB-1.2[]
