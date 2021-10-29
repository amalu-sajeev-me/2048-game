document.addEventListener('DOMContentLoaded', function() {
    const gridDisplay   = document.querySelector('#grid');
    const scoreDisplay  = document.querySelector('#score');
    let squares = [], score = 0, width = 4;
    (function createBoard(width = 4) {
        for(let i = 0; i < (width * width); i++) {
            let sqr = document.createElement('div');
            sqr.innerText = 0;
            gridDisplay.appendChild(sqr);
            squares.push(sqr);
        }
        generate();
        generate();
    })();
    function leaderBoard() {
        let totalPlayers = localStorage.length;
        let leaderboard = document.getElementById("leaderboard");
        leaderboard.innerHTML = '';
        for(let i=0; i < totalPlayers; i ++){
            leaderboard.innerHTML += 
            `<tr>
                <td>${localStorage.key(i)}</td>
                <td>${localStorage.getItem(localStorage.key(i))}</td>
            </tr>`
        }
    };
    leaderBoard();
    function generate() {
        let randNum = Math.floor(Math.random() * squares.length);
        let rand2o4 = Math.floor(Math.random() * 5);
        if(squares[randNum].innerText == 0) {
            squares[randNum].innerText = (rand2o4 < 4) ? 2: 4;
            checkForGameOver();
        }
        else generate();
    }
    function moveLeft(left = true) {
        for(let i=0; i<16; i++) {
            if(i % 4 === 0) {
                let row = [];
                for(let k=0; k<4; k++)
                    row.push(parseInt(squares[i + k].innerText));
                let filteredRow = row.filter(n=>n);
                let missing     = 4 - filteredRow.length;
                let zeros       = Array(missing).fill(0);
                let newRow      = left ? filteredRow.concat(zeros): 
                                        zeros.concat(filteredRow);
                for(let k=0; k<4; k++)
                    squares[i + k].innerText = newRow[k];
            }
        }
    }
    function moveUp(up = true) {
        for(let i=0; i<4; i++) {
            let column = [];
            for(let k=0; k<4; k++) 
                column.push(parseInt(squares[i + (width * k)].innerText));
            let filteredColumn  = column.filter(n=>n);
            let missing         = 4 - (filteredColumn.length);
            let zeros           = Array(missing).fill(0);
            let newRow          = up ? filteredColumn.concat(zeros): 
                                        zeros.concat(filteredColumn);
            for(let k=0; k<4; k++) 
                squares[i + (width * k)].innerText = newRow[k];
        }
    }
    function combineRow() {
      for (let i =0; i < 15; i++) {
        if (squares[i].innerHTML === squares[i +1].innerHTML) {
          let combinedTotal = (+squares[i].innerText) + (+squares[i +1].innerText)
          squares[i].innerHTML = combinedTotal
          squares[i +1].innerHTML = 0
          score += combinedTotal;
          scoreDisplay.innerHTML = score;
        }
      }
      checkForWin();
    }
  
    function combineColumn() {
      for (let i =0; i < 12; i++) {
        if (squares[i].innerText === squares[i +width].innerText) {
          let combinedTotal = (+squares[i].innerHTML) + (+squares[i +width].innerHTML)
          squares[i].innerHTML = combinedTotal
          squares[i +width].innerHTML = 0
          score += combinedTotal;
          scoreDisplay.innerHTML = score;
        }
      }
      checkForWin();
    }
    function checkForGameOver() {
        let zeros = 0
        for (let i=0; i < squares.length; i++) {
          if (squares[i].innerHTML == 0) {
            zeros++
          }
        }
        if(zeros == 1) {
            combineColumn();
            combineRow();
            generate();
        }
        if (zeros === 0) {
          document.querySelector('#score-container h2').innerHTML = 'You LOSE'
          document.removeEventListener('keyup', control);
        //   setTimeout(() => clear(), 3000);
          let name = prompt('Enter Your name');
          if(name !== "")
          localStorage.setItem(name, score);
          leaderBoard();
        }
      }
      function checkForWin() {
        for (let i=0; i < squares.length; i++) {
          if (squares[i].innerHTML == 2048) {
            document.querySelector('#score-container h2').innerHTML = 'You WIN'
            document.removeEventListener('keyup', control)
            // setTimeout(() => clear(), 3000);
          }
        }
      }


    // BOX COLORS 
    document.addEventListener('keyup', control);
    function control(e) {
        if(e.key === 'ArrowLeft') {
            moveLeft();
            combineRow();
            moveLeft();
            generate();
        } else if (e.key === 'ArrowUp') {
            moveUp();
            combineColumn();
            moveUp();
            generate();
        } else if (e.key === 'ArrowRight') {
            moveLeft(false);
            combineRow();
            moveLeft(false);
            generate();
        } else if (e.key === 'ArrowDown') {
            moveUp(false);
            combineColumn();
            moveUp(false);
            generate();
        }
    }
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
  addColors()
  setInterval(addColors, 50);
});