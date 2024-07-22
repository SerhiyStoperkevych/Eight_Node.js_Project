import React from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate('/menu/tasks')}>Tasks</button>
            <button onClick={() => navigate('/menu/chat')} >Chat</button>
            <button onClick={() => navigate('/menu/store')} >Store</button>
        </div>
    );
};

export default Menu;
