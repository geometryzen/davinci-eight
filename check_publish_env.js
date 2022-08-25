if (!process.env.PUBLISH) {
	console.error('npm publish must be run with the PUBLISH environment variable set.');
	console.log('e.g. export PUBLISH=1')
	process.exit(1);
}
