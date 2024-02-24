import React from 'react';
import './App.css';
export default function Main(props){
    return (
        <div className="main-body">
            <p >{props.rdata} </p>
        </div>
    );
}