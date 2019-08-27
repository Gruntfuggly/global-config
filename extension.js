
let vscode = require( 'vscode' ),
    fs = require( 'fs-extra' ),
    os = require( 'os' ),
    path = require( 'path' );

function activate( context )
{
    var outputChannel;

    function copyConfig()
    {
        function debug( text )
        {
            if( outputChannel === undefined )
            {
                outputChannel = vscode.window.createOutputChannel( "Global Config" );
            }

            outputChannel.appendLine( text );
        }

        function copyToWorkspace( workspacePath )
        {
            debug( " Updating " + workspacePath + " from " + source );

            let destination = path.join( workspacePath, ".vscode" );
            fs.ensureDirSync( destination );

            let links = vscode.workspace.getConfiguration( 'global-config' ).get( 'links' );

            fs.readdir( source, ( err, list ) =>
            {
                if( err )
                {
                    debug( err );
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
                                debug( "  Ignoring existing " + target );
                            }
                            else
                            {
                                if( links.indexOf( entry ) > -1 )
                                {
                                    debug( "  Linking " + entry + " -> " + destination );
                                    fs.symlinkSync( file, target );
                                }
                                else
                                {
                                    debug( "  Copying " + entry + " -> " + destination );
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
            debug( "Updating workspaces..." );
            vscode.workspace.workspaceFolders.map( function( workspaceFolder )
            {
                copyToWorkspace( workspaceFolder.uri.fsPath );
            } );
        }
    }

    let disposable = vscode.commands.registerCommand( 'global-config.copy', copyConfig );

    context.subscriptions.push( disposable );
}
exports.activate = activate;
exports.deactivate = () => { };
