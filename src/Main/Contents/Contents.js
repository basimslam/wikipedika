import React from 'react';
import chevron from '../../assets/chevron-white.png';
const Contents = (props) => {
    const titles = props.titles;
    return (
        <div className='contents'>
            <h1>Contents</h1>
            <div className='subtitles'>
            {
            titles.map((title) => (
                <div className='subtitle'>
                    <img src={chevron}/>
                    <p className='stitle'>{title}</p>
                </div>
            
            ))
            }
            </div>
        </div>
    );
};

export default Contents;
