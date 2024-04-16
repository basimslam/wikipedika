import React, { useState, useEffect } from 'react';
import chevron from '../../assets/chevron-white.png';
import chevronGreen from '../../assets/chevron.png';
const Contents = (props) => {
    const titles = props.titles;
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    useEffect(() => {
        // Set a timeout to change the state after 1000 milliseconds (1 second)
        const timeout = setTimeout(() => {
            setIsLoaded(true);
        }, 2000);
        const handleScroll = () => {
            // Get the height of the header
            const headerHeight = document.querySelector('.header-section').offsetHeight;

            // Check the scroll position
            if (window.scrollY > headerHeight) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        // Attach event listener for scrolling
        window.addEventListener('scroll', handleScroll);

        // Cleanup function to clear the timeout to prevent memory leaks
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('scroll', handleScroll);};
    }, []);

    
    
    const scrollToTarget = (id) => {
        console.log("scrolling to", id);
        setSelectedItem(id);
        const targetElement = document.getElementById(id);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            targetElement.click();
        } else {
            console.error(`Element with ID "${id}" not found.`);
        }
        
    };
    return (
        <div className={`contents ${isFixed ? 'fixed' : 'not-fixed'}`}>
            <h1>Contents</h1>
            <div className='subtitles'>
            {
            titles.map((title,index) => (
                <div className={`subtitle ${selectedItem === index ? 'selected' : ''}`} onClick={() => scrollToTarget(index)}>
                    <img src={selectedItem === index ? chevronGreen : chevron}/>
                    <p className='stitle'>{title}</p>
                </div>
            
            ))
            }
            </div>
        </div>
    );
};

export default Contents;
