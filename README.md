[![GitHub license](https://img.shields.io/github/license/Syed-Umair/electron-window-shortcut.svg)](https://github.com/Syed-Umair/electron-window-shortcut/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/Syed-Umair/electron-window-shortcut.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FSyed-Umair%2Felectron-window-shortcut)

# electron-window-shortcut
A Node.js Module for electron apps to bring back the browser window based shortcuts in electron engine >= 3.x.x

## Install Module
```
    npm install electron-window-shortcut
```

## Usage

```javascript
const {
    register,
    unregister,
    attachToWebContent
} = require('electron-window-shortcut');

register('Command+G', (event)=>{
    event.preventDefault();
    console.log('Command+G pressed..');
});

unregister('Command+G');

attachToWebContent(webContent);
```
