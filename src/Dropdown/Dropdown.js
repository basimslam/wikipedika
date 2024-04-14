import React, { useState } from 'react';
import Lottie from 'lottie-react';
import contentAnimation from '../assets/content-loading.json';
import DropPH from '../Placeholders/DropPH';
import './Dropdown.css';
import dropdownline from '../assets/dropdown-line.png';
export default function Dropdown(props) {
    const [contents, setContents] = useState({});
    const [dropResult, setDropResult] = useState([]);

    const handleSubtitleClick = async (subtitle) => {
        const model = props.genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Give a long summary about the ${subtitle} relating to ${props.topic} in paragraphs in pure text with strictly no headings`;
        
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
                    if (text.length> 700){
                        setContents(prevState => ({
                            ...prevState,
                            [subtitle]: text.trim()
                        }));
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 30));
                }
                text += '\n';
                if (text.length> 700){
                    setContents(prevState => ({
                        ...prevState,
                        [subtitle]: text.trim()
                    }));
                }
            }
            text = text.slice(0, -2);
            
        }
    };

    return (
        <div className="dropdown">
            <div className="subtitle">
                {props.dropResult.map((subtitle, index) => (
                    subtitle.trim().length > 0 && (
                        <div key={index} className='sub-button'>
                            <div id={index.toString()} className='bottom-heading sub-button' onClick={() => handleSubtitleClick(subtitle)}>{subtitle.replace(/\*/g, '')}</div>
                            <img src={dropdownline} alt='dropdownline' className='dropdownline sub-button'/>
                            {contents[subtitle] === "loading" ? (
                                <DropPH/>
                            ) : (
                                contents[subtitle] && <div className='sub-content'>{contents[subtitle]}</div>
                            )} 
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
