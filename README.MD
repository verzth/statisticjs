# statisticjs
[![GitHub version](https://badge.fury.io/gh/verzth%2Fstatisticjs.svg)](https://badge.fury.io/gh/verzth%2Fstatisticjs)
[![npm version](https://badge.fury.io/js/%40verzth%2Fstatisticjs.svg)](https://badge.fury.io/js/%40verzth%2Fstatisticjs)

Javascript Library for Statistic Engine, it use in client side to help make auth simpler.
For Android SDK version can be found [here](https://github.com/amandjaja/statistic-android).

### Dependencies
- [crypto-js](https://www.npmjs.com/package/crypto-js)
- [jquery](https://jquery.com/)
- [TCX-JS](https://github.com/verzth/tcx-js)

### Installation
NPM
```bash
npm i @verzth/statisticjs
```
or
```bash
npm i --save @verzth/statisticjs
```

### How to Use:
1. Add script in your html, use statistic.min.js for minified version, or you can use statistic.bundle.js for minified version
   which was included tcx.bundle.js, all our bundle (By verzth) doesn't include jquery, so you need to add your own script
   (Because jquery frequently used by developers).
   ```html
   <script src="{file_path}/statistic.js"></script>
   ```

2. Initialize Statistic object with params, it will use default value if you don't provide params.
   ```javascript
   var statistic = new Statistic({
    serverUrl : '',
    page : 'host',
    page_type : 'website',
    type : 'hit',
    key : 'YOUR_KEY'
   });
   ```
3. Available function:

   - `isModelAvailable()`: boolean - Check statistic data model availability.
   - `dismiss()`: void - Dismiss data model, also mark model as not available.
   - `isDataAvailable()`: boolean - Check statistic data queue inside model.
   - `clearData()`: void - Clear all data queue inside model.
   - `setPage(string page)`: Statistic - Set Page name.
   - `setPageType(string type)`: Statistic - Set Page type.
   - `setInteraction(boolean interaction)`: Statistic - Set Interaction type, "true" user action, "false" system action.
   - `setUserID(string id)`: Statistic - Set User ID, for logged in action.
   - `send()`: void - Send statistic data to server.
   - `putCustom(string key, string value)`: Statistic - Add custom attribute to statistic model.
   - `createHit()`: Statistic - Create statistic hit level type.
   - `createContent()`: Statistic - Create statistic content level type.
        - `setID(string id)`: Statistic - Set Content ID.
        - `setType(string type)`: Statistic - Set Content Type.
        - `setCategory(string category)`: Statistic - Set Content Category.
        - `setAction(string action)`: Statistic - Set Action of Content (Ex: Impression, Click, etc).
        - `setCallforward(string url)`: Statistic - Set forward action link to trigger backend realtime action.
   - `makeContent()`: Statistic
        - `addContent()`: Statistic - Add content to the content data model.
        - `commit()`: Statistic - Close content transaction and push to server.
   - `createEvent()`: Statistic - Create statistic event level type.
        - `setID(string id)`: Statistic - Set Event ID such as invoice number.
        - `setType(string type)`: Statistic - Set Event Type.
        - `setCategory(string category)`: Statistic - Set Event Category.
        - `setName(string name)`: Statistic - Set Name of Event (Ex: Sale, Buy, Play, Open App, etc).
        - `setCallforward(string url)`: Statistic - Set forward action link to trigger backend realtime action.
        - `setOk(boolean state|true)`: Statistic - Set event status state.
        - `setStatus(string status)`: Statistic - Set event status.
        - `setStatusCode(string code)`: Statistic - Set event status code.
        - `setStatusMessage(string message)`: Statistic - Set event status message.
   - `makeEvent()`: Statistic
        - `addEvent()`: Statistic - Add event to the event data model.
        - `commit()`: Statistic - Close event transaction and push to server.

*Note: This library only available for internal corporate / 3rd Party usages, some features may not described.
