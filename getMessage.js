let url;
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

module.exports = getMessage;
