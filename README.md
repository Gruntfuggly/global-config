# Global Config

I got fed up constantly having to copy shared configuration files (tasks.json, settings.json, launch.json and cpp_properties.json) into every folder in my project (there are hundreds) so this extension simply adds a command `Copy Global Config` to copy them into the local *.vscode* folder from a shared location.

In-built support for shared config is apparently on the radar (for [standard vscode ](https://github.com/Microsoft/vscode/issues/1435) and for the [cpp extension](https://github.com/Microsoft/vscode-cpptools/issues/996)), but it seems to be taking a while, so this might be useful until it arrives.

_Note: Existing files will not be replaced._

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.global-config).

Alternatively, open Visual Studio code, press `Ctrl+P` or `Cmd+P` and type:

    > ext install global-config

### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/global-config).

## Configuration

`global-config.folder`

Use this to set which folder should contain your shared config files. The default is `~/.vscode`. Only files are copied (no folders).

`global-config.links`

This is an array of files which should be symlinked instead of copied. This is useful for files which may change in the future, e.g. settings.json
