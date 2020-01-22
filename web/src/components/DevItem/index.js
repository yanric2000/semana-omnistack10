import React from 'react';
import './index.css';

function DevItem(props){
    const { dev } = props;

    return (
        <li className="dev-item" key={dev._id}>
            <header>
            <img src={ dev.avatar_url } alt={ dev.name }/>
            <div className="user-info">
                <strong> { dev.name } </strong>
                <p> { dev.techs.join(', ') } </p>
            </div>
            </header>
            <p> { dev.bio } </p>
            <a href={`'https://github.com/${dev.name}`}> Acessar perfil no Github </a>
        </li>
    );
}

export default DevItem;