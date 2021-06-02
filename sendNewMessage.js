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
		await page.waitForTimeout(1500);
		resolve();
	});
}
module.exports = sendNewMessage;
