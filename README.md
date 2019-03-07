# Global Config

I got fed up of constantly having to copy shared configuration files (tasks.json, settings.json, launch.json and cpp_properties.json) into every project folder.(there are hundreds of them) So this extension simply adds a `Copy Global Config` command to copy these configuration files into the project folder from a shared location.

In-built support for shared config is apparently on the radar (for [standard vscode ](https://github.com/Microsoft/vscode/issues/1435) and for the [cpp extension](https://github.com/Microsoft/vscode-cpptools/issues/996)), but it seems to be taking a while, so this might be useful until it arrives.

_Note: Existing files will not be replaced._

## Installation

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.global-config).

Alternatively, open Visual Studio code, press `Ctrl+P` or `Cmd+P` and type:

    > ext install global-config


## Configuration
1) Under vscode settings (`Ctrl+,` or `Cmd+,`) search for `Global-config: Folder`.


2) Provide the complete path of .vscode folder that contains your custom settings (tasks.json, settings.json, launch.json and cpp_properties.json). The default is `~/.vscode`. 


**Note**: Only files are copied (no folders).


3) Now, open any project. Use the keybindings `Ctrl+Shift+P` or `Cmd+Shift+P` and select Copy Global Config. This copies all the **files** present in the global .vscode folder to your current project folder.


### Source Code

The source code is available on GitHub [here](https://github.com/Gruntfuggly/global-config).