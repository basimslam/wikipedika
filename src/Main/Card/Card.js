import React from 'react';
import detailline from '../../assets/detail-line.png';
import './Card.css';
const Card = (props) => {
    function capitalizeFirstLetter(str) {
        if (str === null) {
          return null;
        }
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }
    const cardImage = props.images[0];
    
    
    return (
        <div className='card-container'>
            <div className="card">
            
            <img src={cardImage} className='card-image' />
            <h1 className='card-title'>{capitalizeFirstLetter(props.topic)}</h1>
            {props.details.map((detail, index) => (
                <div className='detail-line'>
                    <img src={detailline} className='underline' />
                    <div className='detail'>
                        <h1 className='card-heading'>{capitalizeFirstLetter(detail[0])}</h1>
                        <p className='card-answer'>{detail[1]}</p>
                    </div>
                    
                </div>

            ))      
            }              
        </div>

        </div>
        
        
    );
};

export default Card;
