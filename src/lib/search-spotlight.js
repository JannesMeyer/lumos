import { spawn } from 'child_process'

var mdfind_process;

export function search() {
	return 'test';
}

/*
http://labs.hoffmanlabs.com/node/1723

mdfind 'kMDItemDisplayName == "*YourTargetFilename*"cd'

List metadata:
mdls -name 'kMDItemFSCreationDate' -raw [Filename]

mdls /Applications/iMovie.app -name kMDItemCFBundleIdentifier /Applications/iMovie.app
mdfind kMDItemAppStoreHasReceipt=1
mdfind kMDItemAppStoreCategory=Games
mdls /Applications/iMovie.app -name kMDItemVersion /Applications/iMovie.app
mdfind kMDItemContentType="com.apple.application-bundle"
*/