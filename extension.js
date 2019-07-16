
let vscode = require( 'vscode' ),
    fs = require( 'fs-extra' ),
    os = require( 'os' ),
    path = require( 'path' );

function activate( context )
{
    function copyConfig()
    {
        function copyToWorkspace( workspacePath )
        {
            console.log( "Updating " + workspacePath + " from " + source );

            let destination = path.join( workspacePath, ".vscode" );
            fs.ensureDirSync( destination );

            let links = vscode.workspace.getConfiguration( 'global-config' ).get( 'links' );

            fs.readdir( source, ( err, list ) =>
            {
                if( err )
                {
                    console.log( err );
                }
                else
                {
                    list.forEach( ( entry ) =>
                    {
                        let file = path.join( source, entry );

                        let stat = fs.statSync( file );
                        if( stat )
                        {
                            let target = path.join( destination, entry );
                            if( fs.existsSync( target ) )
                            {
                                console.log( "Ignoring existing " + target );
                            }
                            else
                            {
                                if( links.indexOf( entry ) > -1 )
                                {
                                    console.log( "linking " + entry + " -> " + destination );
                                    fs.symlinkSync( file, target );
                                }
                                else
                                {
                                    console.log( "copying " + entry + " -> " + destination );
                                    fs.copySync( file, target, { overwrite: false } );
                                }
                            }
                        }
                    } );
                }
            } );
        }

        let source = vscode.workspace.getConfiguration( 'global-config' ).get( 'folder' );

        if( source.startsWith( "~" ) )
        {
            source = path.join( os.homedir(), source.substr( 1 ) );
        }

        if( vscode.workspace.workspaceFolders )
        {
            console.log( "Updating workspaces..." );
            vscode.workspace.workspaceFolders.map( function( workspaceFolder )
            {
                copyToWorkspace( workspaceFolder.uri.fsPath );
            } );
        }
        else
        {
            console.log( "Updating root workspace..." );
            copyToWorkspace( vscode.workspace.rootPath );
        }
    }

    let disposable = vscode.commands.registerCommand( 'global-config.copy', copyConfig );

    context.subscriptions.push( disposable );
}
exports.activate = activate;
exports.deactivate = () => { };
