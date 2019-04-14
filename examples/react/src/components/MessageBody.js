import React from 'react';

const MessageBody = (props) => {
    const [msgContent, onChange, onSubmit] = [props.msgContent, props.onChange, props.onSubmit];
    
    return (
        <div>
            <form>
                <input value={msgContent} onChange={onChange}/>
                <button onClick={onSubmit} type='submit'>Submit</button>
            </form>
        </div>
    );
}

export default MessageBody;
