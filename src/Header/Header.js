import React, {useEffect, useRef} from 'react';
import logo from '../assets/Logo.png';
import Lottie from 'lottie-react';
import './Header.css';
import { useState } from 'react';
import button from '../assets/button.json';
import headerline from '../assets/header-line.svg';
const Header = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const lottieRef = useRef();
    useEffect(() => {
        lottieRef.current.goToAndStop(177, true);
    }, []);
    const handleSubmit = (e) => {
        if(!props.isProcessing)
        {
        lottieRef.current.playSegments([[177,301],[0,177]], true);
          
        e.preventDefault();

        props.handle(props.input);
        }
        else{
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 2000);
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleSubmit(event);
        }
        
      };
   

    const handleChange = (event) => {
        
        props.setInput(event.target.value);
        
    };
    
    return (
        <header className="header-section">
            <div className='app-header'>
                <img src={logo} alt="logo" className="logo" />
                <div className="search-bar-container">
                    <input 
                        id='search-input'
                        className="search-input" 
                        autoComplete='off' 
                        placeholder='Search Here' 
                        type="text" 
                        value={props.input}  
                        name="query" 
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                     <Lottie
                        className='button'
                        
                        animationData={button}
                        autoplay={false}
                        loop={false}
                        speed={1}
                        
                        onClick={handleSubmit}
                        lottieRef={lottieRef}
                      
                    />
                   
                </div>
                <div className="navbar">
                    <h3>Home</h3>
                    <h3>Team</h3>
                    <h3>About</h3>
                </div>
                {isLoading && (
                        <div className="alert">Content Generation in Progress!</div>
                    )}
            </div>
            <img src={headerline} className='headerline' />
        </header>
    );
};

export default Header;
