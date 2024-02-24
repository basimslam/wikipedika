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

    const prompt = "Give a summary about"+ inputValue+ "in paragraphs" ;

    const result = await model.generateContentStream(prompt);
    let text = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
      text += chunkText;
      console.log(text);
      setData(text)
      
    
  }

  }
  return (
    <div className="App">
      <Header handle={handleInput}/>
      <Main  rdata = {data} />
    </div>
  );
}

export default App;
