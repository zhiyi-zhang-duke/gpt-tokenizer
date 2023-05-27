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

  function insertTextAndPressEnter(inputText) {
    const textarea = document.getElementById('prompt-textarea');
    if (!textarea) {
      console.error('Textarea element with ID "prompt-textarea" not found.');
      return;
    }
  
    textarea.innerHTML = inputText;
  
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      which: 13,
      keyCode: 13,
      bubbles: true,
    });
  
    textarea.dispatchEvent(event);
  }  
  
  document.addEventListener("DOMContentLoaded", function() {
    var submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", function() {
        var promptInput = document.getElementById("promptInput").value;
        var rawTextInput = document.getElementById("tokenizedInput").value;
        
        const inputToken = encode(rawTextInput); // encode input
        const prompTokens = encode(promptInput); // encode prompt
    
        // Log the prompt and tokenized text array to the console
        // console.log("Prompt:", promptInput);
        // console.log("Tokenized Input:", rawTextInput)
        console.log("Prompt Length:", promptInput.length);
        console.log("Prompt Token Count:", encode(promptInput).length); // log tokens
        console.log("Input length:", rawTextInput.length)
        console.log("Input Token Count:", inputToken.length); // log tokens
        console.log("Input should be split into", calcSplitTimes(inputToken.length, prompTokens.length), "parts.")

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          if (tabs.length > 0) {
            const tabId = tabs[0].id;
            chrome.tabs.sendMessage(tabId, "showAlert");
          }
        });
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
})();
