import React from 'react';

const Header = (props) => {
    return (
        <div>
            Loged in as: {props.userName}
        </div>
    );
}

export default Header;
