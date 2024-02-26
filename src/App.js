import './App.css';
import Main from './Main';
import Header from './Header';
import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyDOpmIxIFM3ik7MPGpXgdFkLST_HCU28vo");
function App() {
  const [data, setData] = useState("Search to display information");

  async function handleInput(inputValue){
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    setData("loading");
    
    const prompt = "Give a long summary about"+ inputValue+ "in paragraphs in pure text with no markup" ;

    const result = await model.generateContentStream(prompt);
    let text = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      const paragraphs = chunkText.split('\n'); // Split chunk text into paragraphs
      for (const paragraph of paragraphs) {
        const words = paragraph.split(/\s+/); // Split each paragraph into words
        for (const word of words) {
          console.log(word); // Print each word
          text += word + ' '; // Add word to text
          setData(text.trim()); // Update state with trimmed text
          await new Promise(resolve => setTimeout(resolve, 30)); // Adjust delay as needed
        }
        text += '\n'; // Add newline character after each paragraph
        setData(text.trim()); // Update state with trimmed text
      }
      text = text.slice(0, -2);
    }

  }
  return (
    <div className="App">
      <Header handle={handleInput}/>
      <Main  data = {data} />
    </div>
  );
}

export default App;
