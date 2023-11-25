# Game Grid

This is a simple implementation of a game grid system using JavaScript. The code creates a grid-based game where symbols are randomly placed on the grid, and players can interact by removing connected groups of identical symbols.

## Getting Started

### Prerequisites

- Make sure you have a modern web browser that supports ES6 JavaScript features.

### Usage

1. Clone the repository or download the files.
2. Open `index.html` in your web browser.

Alternatively, integrate the provided classes (`Coordinates`, `GameItem`, `Game`) into your existing web application or project to use the game grid system.

## How to Use

### Initializing the Game

To create a game instance, instantiate the `Game` class with optional parameters for the number of columns, rows, and the HTML container ID:

```javascript
const game = new Game(6, 7, "#gameContainer");
```

### Interacting with the Game

- **Clicking on Cells**: Clicking on non-empty cells in the grid will identify and remove connected groups of identical symbols.

### Customization

- Adjust the number of columns and rows in the game grid by passing different values to the `Game` class constructor.
- Modify the symbols used in the game by changing the `GAME_SYMBOLS` array in the code.

## Code Structure

### `Coordinates` Class

Represents the coordinates of a cell in the game grid.

### `GameItem` Class

Represents an element in the game grid, holding a symbol and managing its properties.

### `Game` Class

Manages the game grid, including grid generation, rendering, interaction, and symbol removal logic.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests for any enhancements or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).