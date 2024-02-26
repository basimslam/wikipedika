import React from 'react';
import './App.css';
import Lottie from 'lottie-react';
import animationData from './loading.json';
export default function Main(props){
    if (props.data == "loading"){
        return (
            <div className='loading'>
                <Lottie animationData={animationData} />
            </div>
        );
    }
    else{
        return (
            <div className="main-body">
                <p >{props.data} </p>
            </div>
        );

    }
   
}