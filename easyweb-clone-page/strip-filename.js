'use strict';

const fs = require('fs');
const path =  require('path');

const targetDir = 'out';

function StripFileName(dir) {
	let paths = fs.readdirSync(dir);
	paths.forEach(p => {
		p = path.join(dir, p);
		//console.log('p', p);
		if (fs.statSync(p).isDirectory()) 
			return StripFileName(p);
		// remove @.* dang sau file name
		let fileName = path.basename(p);
		let newFileName = fileName.split('@')[0];
		if (fileName === newFileName)
			return;
		
		fs.rename(p, path.join(dir, newFileName));
	});		
}

StripFileName(targetDir);

function FindFile(targetDir, extList, ret) {
	ret = ret === undefined ? [] : ret;
	fs.readdirSync(targetDir).forEach(p => {
		var absolutePath = path.join(targetDir, p);
		if (fs.statSync(absolutePath).isDirectory())
			return FindFile(absolutePath, extList, ret);
		else {
			if (extList.indexOf(path.extname(absolutePath).toLowerCase()) == -1) return;
			ret.push(absolutePath);
		}	
	});
	return ret;
}

// parse html remove @ trong href
// tim html file
let htmlFiles = FindFile(targetDir, ['.html', '.css']);
console.log('htmlFiles', htmlFiles);
htmlFiles.forEach(filePath => {
	console.log('filePath', filePath);
	let content = fs.readFileSync(filePath).toString();
	// regex search replace @
	content = content.replace(/@[\d\w\.=\-_]+'/g, "'");
	content = content.replace(/@[\d\w\.=\-_]+"/g, '"');
	fs.writeFileSync(filePath, content);
});
