const getMessage = require('./getMessage');

async function filterEmails(page, search, messages) {
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

				const tableTbody = 'table.F.cf.zt tbody';

				const tableBodyList = await page.$$(tableTbody);

				const allTr = await tableBodyList[3].$$('tr');

				for (let i = 0; i < allTr.length; i++) {
					const message = await getMessage(page, allTr[i]);
					messages.push({id: i, ...message});
				}
				await page.waitForTimeout(2000);
				await page.waitForSelector(olderBtnSel);
				const olderBtns = await page.$$(olderBtnSel);
				await olderBtns[1].click();
				await page.waitForTimeout(2000);
			} while (!isDisabled);
		}

		resolve();
	});
}

module.exports = filterEmails;
