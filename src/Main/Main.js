import React from 'react';
import './Main.css';
import Lottie from 'lottie-react';
import animationData from '../assets/loading.json';
import Contents from './Contents/Contents';
import Card from './Card/Card';
export default function Main(props){
    
    if (props.data === "loading"){
        return (
            <div className='loading'>
                <Lottie animationData={animationData} />
            </div>
        );
    }
    else{
        return (
            <div className="main-body">
                <Contents scroll={props.scroll} titles={props.titles} />
                <div className='main-content-container'><p className='main-content'>{props.data} </p></div>
                
                <Card details={props.details} topic = {props.topic} images = {props.images}/>
            </div>
        );

    }
   
}