const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor () {
    this._fieldArray = [];
    this._playerPosition = [];
  }

  get fieldArray() {
    return this._fieldArray;
  }

  get playerPosition() {
    return this._playerPosition;
  }
    // Prints to screen playing field
    print() {
        for(let i = 0; i < this._fieldArray.length; i++) {
            console.log(this._fieldArray[i].join(''));
        }
    }

    // Moves player, updates player position, and marks player path
    movePlayer(direction) {
        const x = this._playerPosition[0];
        const y = this._playerPosition[1];
        let newX;
        let newY;
        switch(direction) {
            case 'S':
                newY = this._playerPosition[1] + 1;
                if(newY >= this._fieldArray.length) {
                    return 'Out';
                } else if(this._fieldArray[newY][x] === hole){
                    return 'Hole';
                } else if(this._fieldArray[newY][x] === hat) {
                    return 'Hat';
                } else {
                    this._fieldArray[newY][x] = pathCharacter;
                    this._playerPosition[1] = newY;
                    return 'Safe';
                }
            case 'N':
                newY = this._playerPosition[1] - 1;
                if(newY < 0) {
                    return 'Out';
                } else if(this._fieldArray[newY][x] === hole){
                    return 'Hole';
                } else if(this._fieldArray[newY][x] === hat) {
                    return 'Hat';
                } else {
                    this._fieldArray[newY][x] = pathCharacter;
                    this._playerPosition[1] = newY;
                    return 'Safe';
                }
            case 'E':
                newX = this._playerPosition[0] + 1;
                if(newX >= this._fieldArray[0].length) {
                    return 'Out';
                } else if(this._fieldArray[y][newX] === hole){
                    return 'Hole';
                } else if(this._fieldArray[y][newX] === hat) {
                    return 'Hat';
                } else {
                    this._fieldArray[y][newX] = pathCharacter;
                    this._playerPosition[0] = newX;
                    return 'Safe';
                }
            case 'W':
                newX = this._playerPosition[0] - 1;
                if(newX < 0) {
                    return 'Out';
                } else if(this._fieldArray[y][newX] === hole){
                    return 'Hole';
                } else if(this._fieldArray[y][newX] === hat) {
                    return 'Hat';
                } else {
                    this._fieldArray[y][newX] = pathCharacter;
                    this._playerPosition[0] = newX;
                    return 'Safe';
                }
        }
    }

    // Generates playing field based on user input and player starting position
    generateField() {
        let width = 0;
        let height = 0;
        let percentHole = 0;
        let newFieldArray = [];
        this._playerPosition = [];

        // Ask user for width of field to generate
        while(width < 10 || width > 20) {
            width = Number(prompt('Enter width of playing field (10 - 20): '));
            if(isNaN(width) === true || width < 10 || width > 20) {
                console.log('');
                console.log('** Please enter a valid number between 10 and 20 **');
                console.log('');
                width = 0;
            }
        }
        // Ask user for height of field to generate
        while(height < 10 || height > 20) {
            height = Number(prompt('Enter height of playing field (10 - 20): '));
            if(isNaN(height) === true || height < 10 || height > 20) {
                console.log('');
                console.log('** Please enter a valid number between 10 and 20 **');
                console.log('');
                height = 0;
            }
        }
        // Ask user for difficulty level
        while(percentHole < 0.15 || percentHole > 0.3) {
            let difficulty = prompt('Enter difficulty level (Easy / Normal / Hard): ').toUpperCase();
            console.log('');
            switch(difficulty) {
                case 'EASY':
                    percentHole = 0.15;
                    break;
                case 'NORMAL':
                    percentHole = 0.22;
                    break;
                case 'HARD':
                    percentHole = 0.30;
                    break;
                default:
                    console.log('**Please pick Easy, Normal, or Hard**');
                    console.log('');
                    break;
            }
        }
        
        // Generate blank field from user sized field
        for (let i = 0; i < height; i++) {
            let horFieldLine = [];
            for (let j = 0; j < width; j++) {
                horFieldLine[j] = fieldCharacter;
            }
            newFieldArray[i] = horFieldLine;
        }
        this._fieldArray = newFieldArray;

        // Add holes to blank field based on user difficulty selection
        let holesToAdd = Math.ceil(this._fieldArray.length * this._fieldArray[0].length * percentHole);
        while(holesToAdd > 0) {
            const x = Math.floor(Math.random() * this._fieldArray[0].length);
            const y = Math.floor(Math.random() * this._fieldArray.length);
            if(this._fieldArray[y][x] === fieldCharacter) {
                this._fieldArray[y][x] = hole;
                holesToAdd--;
            }
        }

        // Add hat to field
        let hatAdded = false;
        while(hatAdded === false) {
            const x = Math.floor(Math.random() * this._fieldArray[0].length);
            const y = Math.floor(Math.random() * this._fieldArray.length);
            if(this._fieldArray[y][x] === fieldCharacter) {
                this._fieldArray[y][x] = hat;
                hatAdded = true;
            }
        }

        // Generate player starting position
        while(this._playerPosition.length === 0) {
            const x = Math.floor(Math.random() * this._fieldArray[0].length);
            const y = Math.floor(Math.random() * this._fieldArray.length);
            if(this._fieldArray[y][x] === fieldCharacter) {
                this._fieldArray[y][x] = pathCharacter;
                this._playerPosition.push(x);
                this._playerPosition.push(y);
            }
        }
    } // End of generateField
    
}

function playGame(field) {
    let gameOver = false;
    console.log('');
    console.log('Starting Game!')
    console.log('');
    while(gameOver === false) {
        field.print();
        console.log('');
        let direction = prompt('Which direction would you like to move (N/E/S/W): ');
        console.log('')
        switch(field.movePlayer(direction.toUpperCase())) {
            case 'Safe':
                break;
            case 'Out':
                console.log('Out of bounds, you lose!');
                gameOver = true;
                break;
            case 'Hole':
                console.log('You fell into a hole, you lose!');
                gameOver = true;
                break;
            case 'Hat':
                console.log('You found your hat, you win!!');
                gameOver = true;
                break;
            default:
                break;
        }
    }
    
    
}


function startGame(field) {
    let newGame;
    field.generateField();
    field.print();
    while(newGame != 'Y' && newGame != 'QUIT') {
        console.log('');
        newGame = prompt('Play this field? (Y/N/Quit) ').toUpperCase();
        switch(newGame) {
            case 'Y':
                playGame(field);
                break;
            case 'N':
                field.generateField();
                field.print();
                break;
            case 'QUIT':
                console.log('Quitting Game!');
                break;
            default:
                break;
        }       

    }
    

}

const myField = new Field();

startGame(myField);

