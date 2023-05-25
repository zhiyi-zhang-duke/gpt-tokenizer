'use strict';

import './popup.css';
import { encode } from 'gpt-tokenizer'

(function () {
  document.addEventListener("DOMContentLoaded", function() {
    var submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", function() {
        var promptInput = document.getElementById("promptInput").value;
        var rawTextInput = document.getElementById("tokenizedInput").value;
        
        const encodedInput = encode(rawTextInput); // encode input
    
        // Log the prompt and tokenized text array to the console
        console.log("Prompt:", promptInput);
        console.log("Tokenized Input:", rawTextInput)
        console.log("Number of characters:", rawTextInput.length)
        console.log("Tokens:", encodedInput); // log tokens
      });
  });
})();
