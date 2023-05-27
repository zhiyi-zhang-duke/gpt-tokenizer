'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  (response) => {
    console.log(response.message);
  }
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'CHANGE') {
    console.log("Changing the title of the current tab")
    document.title = request.payload.title;

    //Test functionality
    const textarea = document.getElementById('prompt-textarea');
    if (!textarea) {
      console.error('Textarea element with ID "prompt-textarea" not found.');
      return;
    }
  
    textarea.innerHTML = "Hello world";

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      which: 13,
      keyCode: 13,
      bubbles: true,
    });
    textarea.dispatchEvent(event);
  }
  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});

