
var vscode = require( 'vscode' );
var fs = require( 'fs-extra' );
var os = require( 'os' );
var path = require( 'path' );

function activate( context )
{
    var outputChannel;

    function debug( text )
    {
        if( outputChannel === undefined )
        {
            outputChannel = vscode.window.createOutputChannel( "Global Config" );
        }

        outputChannel.appendLine( text );
    }

    function copyConfig()
    {
        function copyToWorkspace( workspacePath, source )
        {
            debug( " Updating " + workspacePath + " from " + source );

            var defaultDestination = path.join( workspacePath, ".vscode" );
            fs.ensureDirSync( defaultDestination );

            var links = vscode.workspace.getConfiguration( 'global-config' ).get( 'links' );
            var hardLinks = vscode.workspace.getConfiguration( 'global-config' ).get( 'hardLinks' );
            var destinations = vscode.workspace.getConfiguration( 'global-config' ).get( 'destinations' );

            fs.readdir( source, function( err, list )
            {
                if( err )
                {
                    debug( err );
                }
                else
                {
                    list.forEach( function( entry )
                    {
                        var file = path.join( source, entry );

                        var stat = fs.statSync( file );
                        if( stat )
                        {
                            var destination = defaultDestination;

                            if( destinations[ entry ] !== undefined )
                            {
                                destination = destinations[ entry ];
                            }

                            var target = path.join( destination, entry );
                            debug( "target:" + target );

                            if( fs.existsSync( target ) )
                            {
                                debug( "  Ignoring existing " + target );
                            }
                            else
                            {
                                try
                                {
                                    if( hardLinks.indexOf( entry ) > -1 )
                                    {
                                        debug( "  Hard Linking " + entry + " -> " + destination );
                                        fs.link( file, target );
                                    }
                                    else if( links.indexOf( entry ) > -1 )
                                    {
                                        debug( "  Sym Linking " + entry + " -> " + destination );
                                        fs.symlinkSync( file, target );
                                    }
                                    else
                                    {
                                        debug( "  Copying " + entry + " -> " + destination );
                                        fs.copySync( file, target, { overwrite: false } );
                                    }
                                }
                                catch( e )
                                {
                                    debug( "   Failed:" + e
                                    );
                                }
                            }
                        }
                    } );
                }
            } );
        }

        function updateWorkspaces( source )
        {
            if( source )
            {
                if( vscode.workspace.workspaceFolders )
                {
                    debug( "Updating workspaces..." );
                    vscode.workspace.workspaceFolders.map( function( workspaceFolder )
                    {
                        copyToWorkspace( workspaceFolder.uri.fsPath, source );
                    } );
                }
            }
        }

        var source = vscode.workspace.getConfiguration( 'global-config' ).get( 'folder' );

        if( source.startsWith( "~" ) )
        {
            source = path.join( os.homedir(), source.substr( 1 ) );
        }

        var folders = fs.readdirSync( source ).filter( function( entry )
        {
            return fs.statSync( path.join( source, entry ) ).isDirectory();
        } );

        if( folders.length > 0 )
        {
            debug( "Found subfolders in " + source + "..." );
            vscode.window.showQuickPick( folders, { placeholder: "Please select a folder" } ).then( function( selected )
            {
                if( selected )
                {
                    source = path.join( source, selected );
                    debug( " Selected subfolder: " + source );
                    updateWorkspaces( source );
                }
                else
                {
                    source = undefined;
                    debug( " Cancelled" );
                }
            } );
        }
        else
        {
            updateWorkspaces( source );
        }
    }

    var disposable = vscode.commands.registerCommand( 'global-config.copy', copyConfig );

    debug( "Ready" );

    context.subscriptions.push( disposable );
}
exports.activate = activate;
exports.deactivate = function() { };
