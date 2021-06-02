const fs = require('fs');

function createMessageElement(from, body, time, url) {
	let recFrom = from.split(',')[1].trim();
	let messageHead = body.split('-')[0].trim();
	let messageBody = body.split('-')[1].trim();

	return `<li><a rel="noopener" target="_blank" href=${url} class="mb-4 shadow p-3 flex items-center justify-between ">
<div class="text-sm text-black font-semibold">${recFrom}</div>
<div style="max-width: 500px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
" class="px-5 text-sm text-black font-semibold flex items-center">${messageHead} - 

<span style="max-width: 500px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
display: inline-block;" class="text-gray-400 font-normal">${messageBody}</span></div>
<div class="text-xs text-black font-semibold">${time}</div>
</a></li>`;
}

async function createHtml(browser, search, messages) {
	const page = await browser.newPage();

	let list = '';
	for (let i = 0; i < messages.length; i++) {
		const {from, msg, time, url} = messages[i];
		list += createMessageElement(from, msg, time, url);
	}

	const html = `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Gmail Automation</title>
			<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet"><link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
		
		</head>
		<body>
			<div class="container">
				<div class="h-20 bg-red-500 p-5">
					<h2 class="text-white font-bold text-3xl">Gmail</h2>
				</div>
				<div class="container max-w-screen-lg m-auto">

				<div class="mx-5 mt-3">
				 <p>Showing result for: <span class="font-medium">${search}</span></p>
				</div>
				<ul class="p-5">
					${list}         
				</ul>
				</div>
			</div>
		</body>
		</html>
		`;
	await fs.promises.writeFile('./index.html', html);
	const url = 'file://' + __dirname + '/index.html';
	await page.goto(url);
}

module.exports = createHtml;
