import React, {useState} from 'react';
import './Main.css';
import Lottie from 'lottie-react';
import animationData from '../assets/loading.json';
import Contents from './Contents/Contents';
import Card from './Card/Card';
export default function Main(props){
    const [selectedText, setSelectedText] = useState('');
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = (text) => {

        navigator.clipboard.writeText(text)
          .then(() => {
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 2000); // Hide the alert after 2 seconds
          })
          .catch((error) => {
            console.error('Error copying text to clipboard:', error);
            // Handle error (e.g., show an error message to the user)
          });
          setSelectedText('');
      };

    const handleTextSelect = () => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
        setSelectedText(selection.toString());
        const range = selection.getRangeAt(0).getBoundingClientRect();
        setButtonPosition({
            x: range.x + window.scrollX,
            y: range.y + window.scrollY - 40, // Adjust position to appear above text
        });
        }
    };
    const handle= (text)=>{
        console.log("handling");
        setSelectedText('');
        
        props.handleInput(text);
        
    }
    const clearSelection = () => {
        setSelectedText('');
    };
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
                <Contents  titles={props.titles} />
                <div className='main-content-container' >
                    <div className='main-content'onMouseUp={handleTextSelect} onMouseDown={clearSelection}>{props.data} </div>
                    {selectedText && (
                        <div className='popup-container'
                            style={{
                            position: 'absolute',
                            top: buttonPosition.y,
                            left: buttonPosition.x,
                            zIndex: 9999,
                            }}
                         >
                            <div className='popup-button' onClick={()=>handle(selectedText)}>Search</div>

                            <div className='popup-button'onClick={()=>copyToClipboard(selectedText)}>Copy</div>
                         </div>
                    )}
                    {isCopied && (
                        <div className="alert">Your text has been copied!</div>
                    )}
                </div>
                
                <Card details={props.details} topic = {props.topic} images = {props.images}/>
            </div>
        );

    }
   
}