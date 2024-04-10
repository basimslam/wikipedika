import React from 'react';
import { ReactComponent as HeaderLine } from './header-line.svg';
import { ReactComponent as SearchButton } from './search-button.svg';
import './App.css';
import { useState } from 'react';

const Header = (props) => {
    const [inputValue, setInputValue] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchClicked(true);
        props.handle(inputValue);
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <header className="header-section">
            <div className='app-header'>
                <div className="search-bar-container">
                    <input 
                        className="search-input" 
                        autoComplete='off' 
                        placeholder='Search Here' 
                        type="text" 
                        value={inputValue}  
                        name="query" 
                        onChange={handleChange}
                    />
                    <SearchButton className="search-button" onClick={handleSubmit}>Search</SearchButton>
                </div>
                <div className="navbar">
                    <h3>Home</h3>
                    <h3>Team</h3>
                    <h3>About</h3>
                </div>
            </div>
        </header>
    );
};

export default Header;
