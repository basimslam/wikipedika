import './App.css';
import Main from './Main/Main';
import Header from './Header/Header';
import Dropdown from './Dropdown/Dropdown';
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Contents from './Main/Contents/Contents';

const genAI = new GoogleGenerativeAI("AIzaSyDOpmIxIFM3ik7MPGpXgdFkLST_HCU28vo");

function App() {
  const [data, setData] = useState("Search to display information");
  const [topic, setTopic] = useState(null);
  const [dropResult, setDropResult] = useState([]);
  const [details, setDetails] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const [images, setImages] = useState([]);
  
  async function getImages(topic) {
    const apiKey = 'AIzaSyCIh8QGy02-rxK9UgYuPzR5lHXE0TjS8XY';
    const query = topic;
    const cx = '217c23a6ffe4c4dd4';
    const searchType = 'image'; // Add this parameter

    const url = `https://customsearch.googleapis.com/customsearch/v1?q=${query}&cx=${cx}&key=${apiKey}&searchType=${searchType}`;
    let waitTime = 1000; // Initial wait time in milliseconds
  
    async function tryFetch() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 429) {
            console.warn('Rate limit exceeded. Waiting...', waitTime, 'ms');
            await new Promise(resolve => setTimeout(resolve, waitTime));
            waitTime *= 2; // Double wait time for next try
            return tryFetch(); // Retry after waiting
          } else {
            throw new Error(`Error fetching data: ${response.status}`);
          }
        }
        const data = await response.json();
        const images = data.items.map(item => item.link);
        console.log(images);
        setImages(images);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    await tryFetch();
  }
  

  async function getDetails(topic) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const detailPrompt = "provide me important details about " + topic + " that will show up in google card when searched. the response should only contain the data in the format title: answer \n title: answer\n. for example, born on: 28 october 2000 \n nation : india \n";
    const detailStream = await model.generateContentStream(detailPrompt);
    const sdetails = (await detailStream.response).candidates[0].content.parts[0].text;
    const newDetails = sdetails.split("\n");
    const res = [];
    newDetails.map((detail) => { res.push(detail.split(":")) });
    
    setDetails(res);
  }
  async function getSubtitles(topic) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const dropPrompt = "Imagine you are wikipedia. Provide me with subtitles for the topic " + topic + ".Just titles are enough. total number of titles should be between 7 and 15. the response should be comma seperated titles";
      const subtitlesStream = await model.generateContentStream(dropPrompt);
      const subtitles = (await subtitlesStream.response).candidates[0].content.parts[0].text;
      const titles = subtitles.split(/[^a-zA-Z0-9\s']+/).filter(title => title.length > 0);
      console.log(titles);
      setDropResult(titles);
    } catch (error) {
      console.error("Error generating subtitles:", error);
    }
  }
  async function handleInput(inputValue) {
    
    setData("loading");
    setTopic(inputValue);
    
    getDetails(inputValue);
    getSubtitles(inputValue);
    getImages(inputValue);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = "Give a long summary about " + inputValue + " in pure text with strictly no headings. minimum 6 paragraphs should be there";
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
          await new Promise(resolve => setTimeout(resolve, 15));
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
      <div className='body'>
        <Main data={data} titles={dropResult} details = {details} topic = {topic} images={images}/>
        <Dropdown topic={topic} dropResult={dropResult} genAI={genAI}/>
      </div>
    
    </div>
  );
}

export default App;
