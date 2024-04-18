import React, { useState,useRef,useEffect } from 'react';
import Lottie from 'lottie-react';
import contentAnimation from '../assets/content-loading.json';
import DropPH from '../Placeholders/DropPH';
import './Dropdown.css';
import dropdownline from '../assets/dropdown-line.png';
export default function Dropdown(props) {
    const [contents, setContents] = useState({});
    const [dropResult, setDropResult] = useState([]);
    const [selectedText, setSelectedText] = useState('');
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const [isCopied, setIsCopied] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleResize() {
            // Recalculate button position on window resize
            calculateButtonPosition();
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const calculateButtonPosition = () => {
        if (selectedText) {
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                const range = selection.getRangeAt(0).getBoundingClientRect();
                const dropdownRect = dropdownRef.current.getBoundingClientRect();
                setButtonPosition({
                    x: range.x - dropdownRect.x,
                    y: range.y - dropdownRect.y - 40, // Adjust position to appear above text
                });
            }
        }
    };
    useEffect(() => {
        calculateButtonPosition();
    }, [selectedText]);
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
        console.log("handle text select");
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
        setSelectedText(selection.toString());
        console.log("selected text", selection.toString());
        const range = selection.getRangeAt(0).getBoundingClientRect();
        setButtonPosition({
            x: range.x + window.scrollX-350,
            y: range.y + window.scrollY - 1020, // Adjust position to appear above text
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
        console.log("clear ");
    };
    const handleSubtitleClick = async (subtitle) => {
        // Check if content for the subtitle is already loaded
        if (!contents[subtitle]) {
            const model = props.genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Give a long summary about the ${subtitle} relating to ${props.topic} in paragraphs in pure text with strictly NO headings`;
            
            setContents(prevState => ({
                ...prevState,
                [subtitle]: "loading"
            }));
    
            const result = await model.generateContentStream(prompt);
            let text = '';
    
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                const paragraphs = chunkText.split('\n');
                for (const paragraph of paragraphs) {
                    const words = paragraph.split(/\s+/);
                    for (const word of words) {
                        text += word + ' ';
                        if (text.length> 300){
                            setContents(prevState => ({
                                ...prevState,
                                [subtitle]: text.trim()
                            }));
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, 30));
                    }
                    text += '\n';
                    if (text.length> 300){
                        setContents(prevState => ({
                            ...prevState,
                            [subtitle]: text.trim()
                        }));
                    }
                }
                text = text.slice(0, -2);
                
            }
        }
    };
    

    return (
        <div className="dropdown" ref={dropdownRef}>
            <div className="dd-title">
                {props.dropResult.map((subtitle, index) => (
                    subtitle.trim().length > 0 && (
                        <div key={index} className='sub-button'>
                            <div id={index.toString()} className='bottom-heading sub-button' onClick={() => handleSubtitleClick(subtitle)}>{subtitle.replace(/\*/g, '')}</div>
                            <img src={dropdownline} alt='dropdownline' className='dropdownline sub-button'/>
                            {contents[subtitle] === "loading" ? (
                                <DropPH/>
                            ) : (
                                contents[subtitle] && <div className='sub-content' onMouseUp={handleTextSelect} onMouseDown={clearSelection}>{contents[subtitle]}</div>
                            )} 
                            
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
                    )
                ))}
            </div>
        </div>
    );
}
