import './App.css';
import Main from './Main';
import Header from './Header';
import Dropdown from './Dropdown';
import ImageCard from './ImageCard';
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDOpmIxIFM3ik7MPGpXgdFkLST_HCU28vo");

function App() {
  const [data, setData] = useState("Search to display information");
  const [topic, setTopic] = useState(null);
  const [dropResult, setDropResult] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);
  useEffect(() => {
    async function dropdownTitles() {
      if (topic) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const dropPrompt = "Imagine you are wikipedia. Provide me with subtitles for the topic " + topic + ". Just titles are enough.";
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
  }, [topic]);
  
  async function handleInput(inputValue) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    setData("loading");
    setTopic(inputValue);
    
    const prompt = "Give a long summary about " + inputValue + " in paragraphs in pure text with no markup";
    const result = await model.generateContentStream(prompt);
    
    let text = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      const paragraphs = chunkText.split('\n');
      for (const paragraph of paragraphs) {
        const words = paragraph.split(/\s+/);
        for (const word of words) {
          text += word + ' ';
          setData(text.trim());
          await new Promise(resolve => setTimeout(resolve, 30));
        }
        text += '\n';
        setData(text.trim());
      }
      text = text.slice(0, -2);
    }
    setSearchClicked(true);
  }
  
  return (
    <div className="App">
      <Header handle={handleInput} />
      <Main data={data} />
      {/* <Dropdown topic={topic} dropResult={dropResult} genAI={genAI} /> */}
      {searchClicked && <Dropdown topic={topic} dropResult={dropResult} genAI={genAI}/>}
    </div>
  );
}

export default App;
