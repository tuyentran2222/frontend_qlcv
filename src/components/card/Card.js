import React from "react";
import '../card/card.css'
const Card = (props)=> {
    return (
        <div className='status-card col-2 mx-2'>
            <div className="status-card__icon">
                <i className={props.icon}></i>
            </div>
            <div className="status-card__info">
                <h4>{props.count}</h4>
                <span>{props.title}</span>
            </div>
        </div>
    )
}
export default Card