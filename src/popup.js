'use strict';

import './popup.css';
import { encode } from 'gpt-tokenizer'

(function () {
  function calcSplitTimes(inputTextLength, promptLength) {
    if (promptLength > 4096) {
      throw new Error("promptLength should be less than or equal to 4096.");
    }
    
    if (inputTextLength === 0) {
      throw new Error("inputTextLength should not be zero.");
    }
    
    const splitTimes = Math.ceil(inputTextLength / (4096 - promptLength));
    
    return splitTimes;
  }

  function splitString(input, splitTimes) {
    let strLength = input.length;
    let partLength = Math.ceil(strLength / splitTimes);
    
    let result = [];
    for(let i = 0; i < strLength; i += partLength) {
      result.push(input.slice(i, i + partLength));
    }
    
    return result;
  }

  function addPromptToArray(splitText, prompt) {
    return splitText.map(element => `${prompt}${element}`);
  }

  
  document.addEventListener("DOMContentLoaded", function() {
    var submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", function() {
        var promptInputText = document.getElementById("promptInput").value;
        var chunkedTextInput = document.getElementById("chunkedTextInput").value;
        
        const inputTokens = encode(chunkedTextInput); // encode input
        const prompTokens = encode(promptInputText); // encode prompt
    
        // Log the prompt and tokenized text array to the console
        // console.log("Prompt:", promptInput);
        // console.log("Tokenized Input:", rawTextInput)

        // Debug info:
        // console.log("Prompt Length:", promptInputText.length);
        // console.log("Prompt Token Count:", encode(promptInputText).length); // log tokens
        // console.log("Input length:", chunkedTextInput.length)
        // console.log("Input Token Count:", inputTokens.length); // log tokens
        // console.log("Input should be split into", calcSplitTimes(inputTokens.length, prompTokens.length), "parts.")

        const splitTimes = calcSplitTimes(inputTokens.length, prompTokens.length);
        const splitText = splitString(chunkedTextInput, splitTimes);
        console.log("Split text:", splitText)
        const splitTextWithPrompt = addPromptToArray(splitText, promptInputText);


        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          console.log("Tabs: ", tabs)
          const tab = tabs[0];
    
          chrome.tabs.sendMessage(
            tab.id,
            {
              type: 'CHUNKSUBMIT',
              payload: {
                chunkedText: splitTextWithPrompt,
              },
            },
            (response) => {
              console.log('Submitted chunked text to content script');
            }
          );
        });        
      });
      document.getElementById('changeTitleBtn').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          console.log("Tabs: ", tabs)
          const tab = tabs[0];
    
          chrome.tabs.sendMessage(
            tab.id,
            {
              type: 'CHANGE',
              payload: {
                title: "Hello world",
              },
            },
            (response) => {
              console.log('Changed title of current active tab');
            }
          );
        });
      });      
  });
})();
