
let vscode = require('vscode'),
    fs = require('fs-extra'),
    os = require('os'),
    path = require('path');

function activate(context) {
    function copyConfig() {
        let source = vscode.workspace.getConfiguration('global-config').get('folder');

        if (source.startsWith("~")) {
            source = path.join(os.homedir(), source.substr(1));
        }

        let workspacePath;
        if (vscode.workspaceFolders && vscode.workspaceFolders.length > 0) {
            workspacePath = vscode.workspace.workspaceFolders[0];
        }
        if (workspacePath === undefined) {
            workspacePath = vscode.workspace.rootPath;
        }

        let destination = path.join(workspacePath, ".vscode");
        fs.ensureDirSync(destination);

        let links = vscode.workspace.getConfiguration('global-config').get('links');

        fs.readdir(source, function (err, list) {
            if (err) {
                console.log(err);
            }
            else {
                list.forEach(function (entry) {
                    let file = path.join(source, entry);

                    let stat = fs.statSync(file);
                    if (stat && !stat.isDirectory()) {
                        let target = path.join(destination, entry);
                        if (links.indexOf(entry) > -1) {
                            if (!fs.existsSync(target)) {
                                fs.symlinkSync(file, target);
                            }
                        }
                        else {
                            fs.copySync(file, target, { overwrite: false });
                        }
                    }
                });
            }
        });
    }

    let disposable = vscode.commands.registerCommand('global-config.copy', copyConfig);

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
