document.addEventListener('DOMContentLoaded', function() {
  // Executing functions after the DOM content has loaded
    const gridDisplay   = document.querySelector('#grid'); // access game board
    const scoreDisplay  = document.querySelector('#score');// access score board
    let squares = [], score = 0, width = 4;
    function createBoard(width = 4) {
   // create individual squares dynamically
        for(let i = 0; i < (width * width); i++) {    // width * width dimension
            let sqr = document.createElement('div');
            sqr.innerText = 0;           // assign initial value 0 to the square
            gridDisplay.appendChild(sqr);    // append squares to the game board
            squares.push(sqr);                    // save the square in an array
        }
        generate();    // generate initial values to the game board for the game
        generate();
    };
    createBoard(); // invoking function
    function leaderBoard() {  // access the players scores from the localStorage
      // get the total number of players
        let totalPlayers = localStorage.length; 
      // get the leaderboard from DOM
        let leaderboard = document.getElementById("leaderboard");
      // set the leaderboard to blank initially
        leaderboard.innerHTML = 
                              `<thead>
                                <td>Rank</td>
                                <td>Name</td>
                                <td>Score</td>
                              </thead>`;
      // get players scores from localStorage
        let players = [];
      // save the player's data as an array
        for (let i=0;i<localStorage.length; i++) {
          let player = [localStorage.key(i),localStorage.getItem(localStorage.key(i))];
          players.push(player);
        }
      // sort the players by their score
        players.sort((a,b)=>b[1]-a[1]);
      // print the players
        for(player of players) {
            leaderboard.innerHTML += 
            `<tr>
                <td></td>
                <td>${player[0]}</td>
                <td>${player[1]}</td>
            </tr>`;
        }
    };
    leaderBoard();                                    // display the leaderboard
    
    function generate() {                         // generate new tiles randomly
      // pick a random position
        let randNum = Math.floor(Math.random() * squares.length);
      // choose 2 or 4 randomly
        let rand2o4 = Math.floor(Math.random() * 5);
      // generate new tiles randomly
        if(squares[randNum].innerText == 0) {
            squares[randNum].innerText = (rand2o4 < 4) ? 2: 4;
            checkForGameOver();                  // check if we can play further
        }
      // call the function recursively untill it finds an empty square
        else generate(); 
    }

    // move the tiles left and right according to the key pressed
    function moveLeft(left = true) {
        for(let i=0; i<16; i++) {                      // check all of the tiles
            if(i % 4 === 0) {              // get the start position of each row
                let row = [];
              // get the ties from current row
                for(let k=0; k<4; k++)
                    row.push(parseInt(squares[i + k].innerText));
              // get the non-zero tiles
                let filteredRow = row.filter(n=>n);
              // get the number of empty tiles
                let missing     = 4 - filteredRow.length;
              // create a new array of empty tiles
                let zeros       = Array(missing).fill(0);
              // manipulate the new row according to the key pressed 
                let newRow      = left ? filteredRow.concat(zeros): 
                                        zeros.concat(filteredRow);
              // manipulate the DOM accordingly
                for(let k=0; k<4; k++)
                    squares[i + k].innerText = newRow[k];
            }
        }
    }
  // move the tiles up and down depending on the key pressed
    function moveUp(up = true) {
      // get the tiles from the current column
        for(let i=0; i<4; i++) {
            let column = [];
          // create an array of new column elements
            for(let k=0; k<4; k++) 
                column.push(parseInt(squares[i + (width * k)].innerText));
          // get the non-zero tiles
            let filteredColumn  = column.filter(n=>n);
          // get the number of empty tiles
            let missing         = 4 - (filteredColumn.length);
          // create an array of empty tiles
            let zeros           = Array(missing).fill(0);
          // manipulate the new columns according to the key pressed
            let newRow          = up ? filteredColumn.concat(zeros): 
                                        zeros.concat(filteredColumn);
          // manipulate the DOM accordingly
            for(let k=0; k<4; k++) 
                squares[i + (width * k)].innerText = newRow[k];
        }
    }

  // combine the nearby tiles with the same values (left / right)
    function combineRow() {
      for (let i = 0; i < 15; i++) {
      // check if the nearby tiles have the same value
        if (squares[i].innerHTML === squares[i +1].innerHTML) {
          let combinedTotal = (+squares[i].innerText) + (+squares[i +1].innerText);
        // update the tile with the combined value
          squares[i].innerHTML = combinedTotal;
        // make the nearby tile empty
          squares[i +1].innerHTML = 0   ;
        // update the score 
          score += combinedTotal        ;
        // display the score
          scoreDisplay.innerHTML = score;
        }
      }
      checkForWin(); // check if the game is won or not
    }

  // combine the nearby tiles with the same values (up / down)
    function combineColumn() {
      for (let i =0; i < 12; i++) {
      //  check if the nearby tiles have the same value
        if (squares[i].innerText === squares[i +width].innerText) {
          let combinedTotal = (+squares[i].innerHTML) + (+squares[i +width].innerHTML);
        // update the tile with the combined value
          squares[i].innerHTML = combinedTotal;
        // make the nearby tile empty
          squares[i +width].innerHTML = 0;
        // update the score
          score += combinedTotal;
        // display the score
          scoreDisplay.innerHTML = score;
        }
      }
      checkForWin()   ; // check if the game is won or not
    }

    // check if the game is won or not
    function checkForGameOver() {
        let zeros = 0 ;
        // look for empty tiles
        for (let i = 0; i < squares.length; i++)
          if (squares[i].innerHTML == 0) zeros++;
      // if only one tile is empty, combine the rows and columns if possible.
        if(zeros == 1) {
            combineColumn() ;
            combineRow()    ;
            generate()      ;
        }
      // display the result if there are no empty tiles.
        if (zeros === 0) {
          document.querySelector('#score-container h2').innerHTML = 'You LOSE';
          document.removeEventListener('keyup', control);
        //   setTimeout(() => clear(), 3000);
        // ask for the player's name if the game is over.
          let name = prompt('Enter Your name');
        // save the player's name and score in the localStorage.
          if(name !== "" && name !== null) localStorage.setItem(name, score);
        // update the leaderboard.
          leaderBoard(); 
        }
      }

      // check if the game is won or not.
      function checkForWin() {
        for (let i=0; i < squares.length; i++) {
        // check for the 2048 tile in the entire game board.
          if (squares[i].innerHTML == 2048) {
          // display result if the 2048 tile is found in the game board.
            document.querySelector('#score-container h2').innerHTML = 'You WIN';
          // disable the functions binded to key events.
            document.removeEventListener('keyup', control);
            // setTimeout(() => clear(), 3000);
          }
        }
      }

  // the actions to take on according to the key pressed.
    document.addEventListener('keyup', control);

  // catching key events
    function control(e) {
      // actions to take on pressing the left arrow key.
        if(e.key === 'ArrowLeft') {
            moveLeft()      ;
            combineRow()    ;
            moveLeft()      ;
            generate()      ;
        } // actions to take on pressing the up arrow key.
        else if (e.key === 'ArrowUp') {
            moveUp()        ;
            combineColumn() ;
            moveUp()        ;
            generate()      ;
        } // actions to take on pressing the right arrow key.
        else if (e.key === 'ArrowRight') {
            moveLeft(false) ;
            combineRow()    ;
            moveLeft(false) ;
            generate()      ;
        } // actions to take on pressing the down arrow key.
        else if (e.key === 'ArrowDown') {
            moveUp(false)   ;
            combineColumn() ;
            moveUp(false)   ;
            generate()      ;
        }
    }
  document.querySelector('#r')
  .addEventListener('click', () =>location.reload());

  // change the color of the tiles according to the values they hold.
    function addColors(){
        for(box of squares){
            switch (box.innerText) {
                case '0': box.style.backgroundColor = 'rgb(78, 33, 75)';
                            box.style.color = 'rgb(78, 33, 75)';
                break;
                case '2': box.style.backgroundColor = '#eee4da';
                break;
                case '4': box.style.backgroundColor = '#ede0c8';
                break;
                case '8': box.style.backgroundColor = '#f2b179';
                break;
                case '16': box.style.backgroundColor = '#ffcea4';
                break;
                case '32': box.style.backgroundColor = '#e8c064';
                break;
                case '64': box.style.backgroundColor = '#ffab6e';
                break;
                case '128': box.style.backgroundColor = '#fd9982';
                break;
                case '256': box.style.backgroundColor = '#ead79c';
                break;
                case '512': box.style.backgroundColor = '#76daff';
                break;
                case '1024': box.style.backgroundColor = '#beeaa5';
                break;
                case '2048': box.style.backgroundColor = '#d7d4f0';
                break;
                default: box.style.backgroundColor = 'rgb(78, 33, 75)';
                break;
            }
        } 
    }
  addColors();
  setInterval(addColors, 50);
});