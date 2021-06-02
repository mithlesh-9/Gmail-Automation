const email = process.argv[2].replace('--email=', '');
const password = ''; // gmail password
const search = process.argv[3].replace('--search=', '');

module.exports = {
	email,
	password,
	search,
};
