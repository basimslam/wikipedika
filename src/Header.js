import React from 'react';
import './App.css';
import { useState } from 'react';
export default function Header(props){
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        props.handle(inputValue);
    }
    
    const handleChange = (event) => {
    setInputValue(event.target.value);
  };

    return (
        <header className="App-header">
        
        <div className="search-bar-container">
            <input className = "search-input" type="text" value= {inputValue}  name="query" onChange={handleChange}/>
            <button className= "search-button"  onClick={handleSubmit} type="submit"></button>
        </div>
        
      </header>
    );
}