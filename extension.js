
var vscode = require( 'vscode' ),
    fs = require( 'fs-extra' ),
    os = require( 'os' ),
    path = require( 'path' );

function activate( context )
{
    function copyConfig()
    {
        var source = vscode.workspace.getConfiguration( 'global-config' ).get( 'folder' );

        if( source.startsWith( "~" ) )
        {
            source = path.join( os.homedir(), source.substr( 1 ) );
        }

        var workspacePath;
        if( vscode.workspaceFolders && vscode.workspaceFolders.length > 0 )
        {
            workspacePath = vscode.workspace.workspaceFolders[ 0 ];
        }
        if( workspacePath === undefined )
        {
            workspacePath = vscode.workspace.rootPath;
        }

        var destination = path.join( workspacePath, ".vscode" );
        var links = vscode.workspace.getConfiguration( 'global-config' ).get( 'links' );

        fs.readdir( source, function( err, list )
        {
            if( err )
            {
                console.log( err );
            }
            else
            {
                list.forEach( function( entry )
                {
                    var file = path.join( source, entry );

                    var stat = fs.statSync( file );
                    if( stat && !stat.isDirectory() )
                    {
                        var target = path.join( destination, entry );
                        if( links.indexOf( entry ) > -1 )
                        {
                            if( !fs.exists( target ) )
                            {
                                fs.symlinkSync( file, target );
                            }
                        }
                        else
                        {
                            fs.copySync( file, target, { overwrite: false } );
                        }
                    }
                } );
            }
        } );
    }

    var disposable = vscode.commands.registerCommand( 'global-config.copy', copyConfig );

    context.subscriptions.push( disposable );
}
exports.activate = activate;

function deactivate()
{
}
exports.deactivate = deactivate;
