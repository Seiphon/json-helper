const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "json-helper" is now active!');

	let disposable = vscode.commands.registerCommand('json-data-extracter.extract', function () {
		vscode.window.showInputBox({ prompt: 'Enter property name to extract' }).then(
			property => {
				if (property) {
					const editor = vscode.window.activeTextEditor;

					if (editor) {
						const document = editor.document;
						const text = document.getText();

						try {
							const json = JSON.parse(text);

							const propertyValues = getPropertyValues(json, property);

							const currentFilePath = document.uri.fsPath;

							const outputFileName = `output_${property}.json`;
							const outputFilePath = path.join(path.dirname(currentFilePath), outputFileName);

							fs.writeFileSync(outputFilePath, JSON.stringify(propertyValues, null, 2));

							vscode.window.showInformationMessage(`Property values for ${property}: ${propertyValues.join(', ')}`);
						} catch (error) {
							vscode.window.showErrorMessage('Error parsing JSON: ' + error.message);
						}
					} else {
						vscode.window.showWarningMessage('Open a JSON file before using this command.')
					}
				}
			}
		)

	});

	context.subscriptions.push(disposable);
}

function getPropertyValues(obj, property) {
	const result = [];

	function recurse(obj) {
		for (const key in obj) {
			if (typeof obj[key] === 'object') {
				recurse(obj[key]);
			} else if (key === property) {
				result.push(obj[key]);
			}
		}
	}

	recurse(obj);

	return result;
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
