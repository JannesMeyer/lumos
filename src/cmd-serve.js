module minimist from 'minimist';
module server from './server-main';
import { config } from '../package.json';

export function cmd(args) {
	var argv = minimist(args);

	var port = argv.port || config.defaultPort;
	server.listen(port);
}