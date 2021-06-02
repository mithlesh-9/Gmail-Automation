# Gmail Automation
An Automation bot using puppeteer on Gmail.

# Description
The bot initially send the emails to own email id to make sure the automation works fine while filtering out the emails.
later, the bot filter the emails on the basis of search keyword that needs to be provided while running the bot and get the URL of all the mails and generate the report as html file and display the web page on new tab.


Here's a video which will show the bot in action.

[Video](https://www.linkedin.com/posts/mithleshfantezie_automation-using-puppeteer-for-gmail-initially-activity-6805792818452398080-1AhI)

# Requirements
1. [Nodejs](http://www.nodejs.org/)
2. [Puppeteer](http://www.pptr.dev/)


# Usage
1. Fork the repo and then clone it or download it.

2. First install all dependencies:
    ```bash
    # with npm
    npm install
    
    # or with yarn
    yarn
    ```

4. Add a password in `config.js` file.

    ```javascript
        const email = process.argv[2].replace('--email=', '');
        const password = ''; // Your gmail password here.
        const search = process.argv[3].replace('--search=', '');

    ```
5. Start the server
```javascript
node index.js --email=YOUR EMAIL HERE --search=FILTER THE EMAILS BY SEARCH TERM
```
