import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import animationData from './loading.json';

export default function Dropdown(props) {
    const [contents, setContents] = useState({});
    const [dropResult, setDropResult] = useState([]);

    useEffect(() => {
        async function dropdownTitles() {
            if (props.topic) {
                const model = props.genAI.getGenerativeModel({ model: "gemini-pro" });
                const dropPrompt = `Imagine you are wikipedia. Provide me with subtitles for the topic ${props.topic}. Just titles are enough.`;
                const result = await model.generateContentStream(dropPrompt);
                
                let titles = [];
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    const extractedTitles = chunkText.split('\n').filter(title => title.trim().length > 0);
                    titles = [...titles, ...extractedTitles];
                }
                
                setDropResult(titles);
            }
        }
        
        dropdownTitles();
    }, [props.topic]);

    const handleSubtitleClick = async (subtitle) => {
        const model = props.genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Give a long summary about the ${subtitle} of ${props.topic} in paragraphs in pure text with no markup`;
        
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
                    setContents(prevState => ({
                        ...prevState,
                        [subtitle]: text.trim()
                    }));
                    await new Promise(resolve => setTimeout(resolve, 30));
                }
                text += '\n';
                setContents(prevState => ({
                    ...prevState,
                    [subtitle]: text.trim()
                }));
            }
            text = text.slice(0, -2);
            setContents(prevState => ({
                ...prevState,
                [subtitle]: text.trim()
            }));
        }
    };

    return (
        <div className="dropdown">
            <h3>Contents</h3>
            <div className="subtitle">
                {dropResult.map((subtitle, index) => (
                    subtitle.trim().length > 0 && (
                        <div key={index}>
                         <button onClick={() => handleSubtitleClick(subtitle)}>{subtitle.replace(/\*/g, '')}</button>
                            {contents[subtitle] === "loading" ? (
                                <div className='loading'>
                                    <Lottie animationData={animationData} />
                                </div>
                            ) : (
                                contents[subtitle] && <p>{contents[subtitle]}</p>
                            )}
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
