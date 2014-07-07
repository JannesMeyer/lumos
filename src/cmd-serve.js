module minimist from 'minimist';
module startServer from './server-main';
import { config } from '../package.json';

export function cmd(args) {
	var argv = minimist(args);

	var options = {
		directory: process.cwd(),
		port: argv.port || config.defaultPort
	};
	startServer(options);
}