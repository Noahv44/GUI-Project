# This file contains documentation about the 3D models used in the game, including their formats and how to use them.

## 3D Models for Escape the Jungle Mini Golf

### Overview
This directory contains the 3D models used in the "Escape the Jungle" mini golf game. The models are essential for creating an immersive jungle environment and enhancing the gameplay experience.

### Model Formats
- **.glb**: The primary format used for 3D models in this project. It is a binary version of glTF (GL Transmission Format) and is optimized for web use.
- **.obj**: Some models may be available in this format for compatibility with various 3D modeling tools.

### Usage
To use the models in the game, ensure they are loaded correctly in the `Jungle` class within the `src/game/jungle.ts` file. The models can be imported and instantiated as part of the jungle scene setup.

### Loading Models
When loading models, consider the following:
- Use appropriate loaders (e.g., `GLTFLoader` for .glb files) to ensure the models are rendered correctly.
- Adjust the scale and position of the models to fit the game environment.

### Contributing
If you wish to contribute additional models, please ensure they are optimized for web use and follow the formats specified above. Include any necessary documentation regarding the model's purpose and usage.