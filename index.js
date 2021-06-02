const puppeteer = require('puppeteer');

const {email, password, search} = require('./config');
const createHtml = require('./createHTML');
const sendNewMessage = require('./sendNewMessage');
const filterEmails = require('./filterEmails');

const messages = [];

(async function () {
	try {
		const browser = await puppeteer.launch({
			headless: false,
			defaultViewport: null,
			args: ['--start-maximized'],
		});
		const page = await browser.newPage();

		await page.goto('https://mail.google.com');

		const emailSelector = 'input[type="email"]';
		await page.waitForSelector(emailSelector, {visible: true});
		await page.type(emailSelector, email);

		const nextBtnClass = '.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ';
		await page.click(nextBtnClass);

		const passwordSelector = 'input[type="password"]';
		await page.waitForSelector(passwordSelector, {visible: true});
		await page.type(passwordSelector, password);
		await page.click(nextBtnClass);

		for (let i = 1; i < 15; i++) {
			await sendNewMessage(page, email, 'Automate Test!' + ' ' + i);
		}
		await filterEmails(page, search, messages);
		await page.close();
		await createHtml(browser, search, messages);
	} catch (e) {
		console.log(e);
	}
})();
