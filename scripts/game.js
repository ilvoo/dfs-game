"use strict";

/**
 * Represents a list of game symbols converted to Symbols.
 */
const GAME_ITEMS = ["♣", "♢", "♡", "♠"].map((el) => Symbol(el));

/**
 * Generates a random integer between 0 and the given number, n.
 *
 * @param {number} n - The upper limit of the range for generating a random number.
 * @returns {number} A random integer between 0 and n.
 */
function getRandomNumber(n) {
  return Math.floor(Math.random() * (n + 1));
}

/**
 * Represents a game cell coordinates.
 */
class Coordinates {
  /**
   * Create a new Coordinates object.
   * @constructor
   * @param {number} i - The row index of the game cell.
   * @param {number} j - The column index of the game cell.
   */
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }

  /**
   * Checks if the coordinates are within the specified range.
   * @param {number} rowLength - The maximum value for the row index.
   * @param {number} columnLength - The maximum value for the column index.
   * @returns {boolean} - Returns true if the coordinates are within the specified range, otherwise false.
   */
  isValid(rowLength, columnLength) {
    return (
      this.i >= 0 && this.j >= 0 && this.i < rowLength && this.j < columnLength
    );
  }

  /**
   * Get the coordinates above the current position.
   * @returns {Coordinates} - Returns a new Coordinates object representing the position above the current one.
   */
  up() {
    return new Coordinates(this.i - 1, this.j);
  }

  /**
   * Get the coordinates below the current position.
   * @returns {Coordinates} - Returns a new Coordinates object representing the position below the current one.
   */
  down() {
    return new Coordinates(this.i + 1, this.j);
  }

  /**
   * Get the coordinates to the left of the current position.
   * @returns {Coordinates} - Returns a new Coordinates object representing the position to the left of the current one.
   */
  left() {
    return new Coordinates(this.i, this.j - 1);
  }

  /**
   * Get the coordinates to the right of the current position.
   * @returns {Coordinates} - Returns a new Coordinates object representing the position to the right of the current one.
   */
  right() {
    return new Coordinates(this.i, this.j + 1);
  }
}

/**
 * Represents a separate game element.
 */
class GameItem {
  /**
   * Create a new GameItem object.
   * @constructor
   * @param {Symbol} id - The label and identifier of the game item.
   */
  constructor(id) {
    this.label = id.description;
    this.id = id;
    this.isEmpty = false;
  }

  /**
   * Creates an HTML representation of a game cell based on the value of `isEmpty`.
   * @param {Coordinates} coordinates - The coordinates of the created game cell.
   * @returns {HTMLDivElement} - Returns an HTML div element representing the game cell.
   */
  build(coordinates) {
    let cell = document.createElement("div");
    cell.classList.add("gameCell", "empty");

    if (!this.isEmpty) {
      cell.classList.remove("empty");
      cell.textContent = this.label;
      cell.dataset.i = coordinates.i;
      cell.dataset.j = coordinates.j;
    }

    return cell;
  }
}

/**
 * Represents a game field.
 */
class Game {
  /**
   * Create a new Game object.
   * @constructor
   * @param {number} cols - The number of columns in the game field.
   * @param {number} rows - The number of rows in the game field.
   * @param {string} containerId - The id of the HTML-element where the game will be displayed.
   */
  constructor(cols, rows, containerId) {
    this.cols = cols ?? 6;
    this.rows = rows ?? 7;
    this.containerId = containerId ?? "#game";
    this.init();
    this.grid = this.generateGrid();
    this.visited = [];
    this.paint();
  }

  /**
   * Finds and returns the required HTML-element.
   *
   * @throws Will throw an error if the element with the given id does not exist.
   *
   * @returns {HTMLDivElement}
   */
  getContainer() {
    const container = document.querySelector(this.containerId);

    if (!container)
      throw new Error(
        `HTML-container with id - ${this.containerId} doesn't exist`
      );

    return container;
  }

  /**
   * Randomly creates {@link GameItem}-element.
   *
   * @returns {GameItem}
   */
  generateGridItem() {
    const id = GAME_ITEMS[getRandomNumber(GAME_ITEMS.length - 1)];
    const gameCell = new GameItem(id);

    return gameCell;
  }

  /**
   * Creates game grid and fill it with {@link GameItem}-elements.
   *
   * @returns {GameItem[][]}
   */
  generateGrid() {
    let gameGrid = [];

    for (let i = 0; i < this.rows; i++) {
      let row = [];

      for (let j = 0; j < this.cols; j++) {
        row.push(this.generateGridItem());
      }

      gameGrid.push(row);
    }

    return gameGrid;
  }

  /**
   * Finds and returns list of coordinates of cells forming a group of identical elements.
   * Search starts at given coordinates.
   *
   * @param {Coordinates} coordinates - Coordinates of the game cell on the field.
   * @returns {Coordinates[]} List of coordinates of cells forming a group of identical elements.
   */
  findConnectedGroup(coordinates) {
    const target = this.grid[coordinates.i][coordinates.j];

    const chains = [];

    this.findAdjacentElements(coordinates, target, chains);

    return chains;
  }

  /**
   * Recursively finds adjacent elements forming a group of identical elements.
   *
   * @param {Coordinates} coordinates - Coordinates of the game cell on the field.
   * @param {GameItem} target - The target GameItem to compare with.
   * @param {Coordinates[]} chain - Array to store the chain of connected elements.
   * @returns {void}
   */
  findAdjacentElements(coordinates, target, chain) {
    if (
      !coordinates.isValid(this.grid.length, this.grid[0].length) ||
      (this.visited[coordinates.i] &&
        this.visited[coordinates.i][coordinates.j]) ||
      this.grid[coordinates.i][coordinates.j].id !== target.id
    ) {
      return;
    }

    if (!this.visited[coordinates.i]) this.visited[coordinates.i] = [];
    this.visited[coordinates.i][coordinates.j] = true;

    chain.push(coordinates);

    this.findAdjacentElements(coordinates.up(), target, chain);
    this.findAdjacentElements(coordinates.down(), target, chain);
    this.findAdjacentElements(coordinates.left(), target, chain);
    this.findAdjacentElements(coordinates.right(), target, chain);
  }

  /**
   * Removes a group of connected elements from the game grid.
   *
   * @param {Coordinates[]} group - List of coordinates representing the group to be removed.
   * @returns {void}
   */
  removeGroup(group) {
    group.forEach((coord) => {
      this.grid[coord.i][coord.j].isEmpty = true;
    });

    this.paint();
  }

  /**
   * Renders the game grid on the HTML container.
   *
   * @returns {void}
   */
  paint() {
    const container = this.getContainer();
    container.innerHTML = "";

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const htmlCell = this.grid[i][j].build(new Coordinates(i, j));

        container.appendChild(htmlCell);
      }
    }
  }

  /**
   * Handles click events on game cells.
   *
   * @param {Event} event - The click event object.
   * @param {Game} game - The current Game instance.
   * @returns {void}
   */
  handleClickCell(event) {
    this.visited = [];

    const cell = event.target;

    if (cell.classList.contains("empty")) {
      return;
    }

    const { i, j } = cell.dataset;

    const group = this.findConnectedGroup(new Coordinates(+i, +j));
    this.removeGroup(group);
  }

  /**
   * Initializes the game by setting up the container and event listeners.
   *
   * @returns {void}
   */
  init() {
    const container = this.getContainer();

    container.classList.add("game");
    container.style = `--columns: ${this.cols}`;

    container.addEventListener("click", (e) => this.handleClickCell(e));
  }
}
