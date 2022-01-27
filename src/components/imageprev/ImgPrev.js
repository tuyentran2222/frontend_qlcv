import React, { useState } from 'react';

import './style.css';
import { AppContext } from '../context/Context';
const ImgPrev = () => {
    const value = React.useContext(AppContext);
    const [avatar,setAvatar] = value.avatar;
    const [{alt, src}, setImg] = useState({
        src: avatar,
        alt: 'Upload an Image'
    });
  
    const handleImg = (e) => {
        if(e.target.files[0]) {
            setImg({
                src: URL.createObjectURL(e.target.files[0]),
                alt: e.target.files[0].name
            });
            console.log(e.target.files[0]);
            setAvatar(e.target.files[0]);
        }   
    }

    return (
        <div className="form__img-input-container">
            <input
                type="file"
                name='avatar'
                accept=".png, .jpg, .jpeg" 
                id="photo" 
                className="visually-hidden"
                onChange={handleImg}
            />
            <label htmlFor="photo" className="form-img__file-label">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#56ceef" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                </svg>
            </label>
            <img src={src} alt={alt} className="form-img__img-preview"/>
        </div>
    );
}

export default ImgPrev;