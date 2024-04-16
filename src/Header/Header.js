import React, {useRef} from 'react';
import logo from '../assets/Logo.png';
import Lottie from 'lottie-react';
import './Header.css';
import { useState } from 'react';
import button from '../assets/button.json';
import headerline from '../assets/header-line.svg';
const Header = (props) => {
    const [inputValue, setInputValue] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);
    const lottieRef = useRef();

    const handleSubmit = (e) => {
        
        e.preventDefault();
        setSearchClicked(true);
        props.handle(inputValue);
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleSubmit(event);
        }
      };
   

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };
    
    return (
        <header className="header-section">
            <div className='app-header'>
                <img src={logo} alt="logo" className="logo" />
                <div className="search-bar-container">
                    <input 
                        className="search-input" 
                        autoComplete='off' 
                        placeholder='Search Here' 
                        type="text" 
                        value={inputValue}  
                        name="query" 
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                     <Lottie
                        className='button'
                        initialSegment={[177, 177]}
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
            </div>
            <img src={headerline} className='headerline' />
        </header>
    );
};

export default Header;
