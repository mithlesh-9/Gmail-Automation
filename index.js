const puppeteer = require('puppeteer');

const {email, password} = require('./config');
const fs = require('fs');
// const email = process.argv[2].replace('--email=', '');
// const password = process.argv[2].replace('--password=', '');
// console.log(process.argv);

//@ TODO impletement try catch
(async function () {
	try {
		const search = 'from:me';
		const browser = await puppeteer.launch({
			headless: false,
			defaultViewport: null,
			args: ['--start-maximized'],
		});
		const page = await browser.newPage();
		const url = 'file://' + __dirname + '/index.html';
		console.log(url);
		await page.goto(url);

		// await page.goto('https://mail.google.com');

		// const emailSelector = 'input[type="email"]';
		// await page.waitForSelector(emailSelector, {visible: true});
		// await page.type(emailSelector, email);

		// const nextBtnClass = '.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ';
		// await page.click(nextBtnClass);

		// const passwordSelector = 'input[type="password"]';
		// await page.waitForSelector(passwordSelector, {visible: true});
		// await page.type(passwordSelector, password);
		// await page.click(nextBtnClass);

		// await browser.close();
	} catch (e) {
		console.log(e);
	}
})();
// await filterEmails(page, search);
// for (let i = 1; i < 20; i++) {
// 	await sendNewMessage(page, 'test939339@gmail.com', 'Automate Test!');
// }
let url;
const messages = [];
async function filterEmails(page, search) {
	return new Promise(async function (resolve) {
		const searchInp = 'input[aria-label="Search mail"]';
		await page.waitForSelector(searchInp, {visible: true});
		await page.waitForTimeout(1000);
		await page.type(searchInp, search);
		await page.keyboard.press('Enter');
		await page.waitForTimeout(1000);

		const isUnReadBtn = 'div[data-type="H7du2"]';
		await page.waitForSelector(isUnReadBtn, {visible: true});
		await page.click(isUnReadBtn);

		await page.waitForTimeout(1000);
		const isUnRead = await page.$(isUnReadBtn);
		const isPressed = await isUnRead.evaluate(function (elem) {
			return elem.getAttribute('aria-pressed');
		});
		await page.waitForTimeout(2000);

		if (isPressed) {
			const olderBtnSel = 'div[aria-label="Older"]';
			await page.waitForSelector(olderBtnSel);
			let isDisabled = true;

			do {
				const olderBtnList = await page.$$(olderBtnSel);
				isDisabled = await page.evaluate(function (elem) {
					return elem.getAttribute('aria-disabled');
				}, olderBtnList[1]);

				console.log(isDisabled);

				const tableTbody = 'table.F.cf.zt tbody';

				const tableBodyList = await page.$$(tableTbody);

				const allTr = await tableBodyList[3].$$('tr');

				console.log(allTr.length);
				for (let i = 0; i < allTr.length; i++) {
					console.log(i);
					const message = await getMessage(page, allTr[i]);
					console.log(message);
					messages.push({id: i, ...message});
				}
				await page.waitForTimeout(2000);
				await page.waitForSelector(olderBtnSel);
				const olderBtns = await page.$$(olderBtnSel);
				await olderBtns[1].click();
				await page.waitForTimeout(2000);
			} while (!isDisabled);

			await fs.promises.writeFile('./messages.json', JSON.stringify(messages));
		}

		resolve();
	});
}

function getMessage(page, tr) {
	return new Promise(async function (resolve) {
		const messageData = await page.evaluate(async function (tr) {
			tr.click();
			const from = tr.children[3].textContent;
			const msg = tr.children[4].textContent;
			const time = tr.children[7].textContent;
			return {
				from,
				msg,
				time,
			};
		}, tr);

		const backBtn = 'div.T-I.J-J5-Ji.lS.T-I-ax7.mA';
		await page.waitForSelector(backBtn, {visible: true});
		url = await page.url();
		messageData.url = url;
		await page.click(backBtn);
		resolve(messageData);
	});
}

async function sendNewMessage(page, to, bodyText) {
	return new Promise(async function (resolve) {
		const composeBtn = '.T-I.T-I-KE.L3';
		await page.waitForSelector(composeBtn, {visible: true});
		await page.click(composeBtn);

		const messageBody = 'div[aria-label="Message Body"]';
		const messageTo = 'textarea[aria-label="To"]';

		await page.waitForSelector(messageBody, {visible: true});
		await page.type(messageTo, to);

		const bodyDiv = await page.$(messageBody);
		await page.evaluate(
			function (elem, bodyText) {
				elem.textContent = bodyText;
			},
			bodyDiv,
			bodyText
		);

		const sendBtn = '.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3';
		await page.click(sendBtn);
		resolve();
	});
}
