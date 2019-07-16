# Global Config

I got fed up constantly having to copy shared configuration files (tasks.json, settings.json, launch.json and cpp_properties.json) into every folder in my project (there are hundreds) so this extension simply adds a command `Copy Global Config` to copy them into the local *.vscode* folder from a common location.

In-built support for shared config is apparently on the radar (for [standard vscode ](https://github.com/Microsoft/vscode/issues/1435) and for the [cpp extension](https://github.com/Microsoft/vscode-cpptools/issues/996)), but it seems to be taking a while, so this might be useful until it arrives.

To use:

1. Place your default files (e.g. `tasks.json`, `settings.json`, `launch.json`, etc.) in a folder somewhere. By default, the extension will look in `~/.vscode/`.
2. If you choose a different folder, open your settings and point `global-config.folder` to that folder.
3. Open a new VSCode window and run the `Global Config: Copy Global Config` command, to copy (or link) the files into your local folder (.vscode).

*Note: Existing files will not be replaced.*

When used in a multi-root workspace folder, the global files are copied into each workspace *.vscode* folder.

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.global-config).

Alternatively, open Visual Studio code, press `Ctrl+P` or `Cmd+P` and type:

    > ext install global-config

### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/global-config).

## Configuration

`global-config.folder`

Use this to set which folder should contain your shared config files. The default is `~/.vscode`.

`global-config.links`

This is an array of files which should be symlinked instead of copied. This is useful for files which may change in the future, e.g. settings.json
