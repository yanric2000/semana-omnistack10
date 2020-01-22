import React, { useState, useEffect } from 'react';

/* Componente filho recebe uma funcao do pai */

function DevForm({ onSubmit }) {
    const [latitude, setLatitude] = useState([]);
    const [longitude, setLongitude] = useState([]);
    const [github_username, setGithubUsername] = useState([]);
    const [techs, setTechs] = useState([]);

    // Cuida das localizações
    useEffect( () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                setLatitude(latitude);
                setLongitude(longitude);
            },
            (err) => {
                console.log(err);
            },
            {
                timeout: 30000
            }
        )
    }, [] );

    async function handleSubmit(e){
        e.preventDefault();

        /* Vai chamar a funcao do pai que foi passado via props  */

        await onSubmit({
            github_username,
            techs,
            latitude,
            longitude,
        });

        setGithubUsername('');
        setTechs('');
    }

    /* Quando o form for submitado vai chamar a funcao que contem o prevent default */
    return (
        <form onSubmit={handleSubmit}>
            <div className="input-block">
                <label htmlFor="github_username"> Usuário do Github </label>
                <input
                    required
                    name="github_username"
                    id="github_username"
                    type="text"
                    onChange={ (e) => { setGithubUsername(e.target.value) } }
                    value={github_username}
                />
            </div>

            <div className="input-block">
                <label htmlFor="techs"> Tecnologias </label>
                <input
                    required
                    name="techs"
                    id="techs"
                    type="text"
                    onChange={ (e) => { setTechs(e.target.value) } }
                    value={techs}
                />
            </div>

            <div className="input-group">
                <div className="input-block">
                    <label htmlFor="latitude"> Latitude </label>
                    <input
                        required
                        name="latitude"
                        id="latitude"
                        type="number"
                        value={latitude}
                        onChange={ (e) => { setLatitude(e.target.value) } }
                    />
                </div>
                <div className="input-block">
                    <label htmlFor="longitude"> Longitude </label>
                    <input
                        required
                        name="longitude"
                        id="longitude"
                        type="number"
                        value={longitude}
                        onChange={ (e) => { setLongitude(e.target.value) } }
                    />
                </div>
            </div>
            <button type="submit"> Salvar </button>
        </form>
    );
}

export default DevForm;