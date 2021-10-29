document.addEventListener('DOMContentLoaded', () => {
    let leaderBoard = document.querySelector('.list ol');
    for(let i = 0; i < localStorage.length; i++) {
        leaderBoard.innerHTML += `<li>${localStorage.key(i)}: ${
            localStorage.getItem(localStorage.key(i))
        }</li>`
    } 
    
    let grid = document.querySelector('#grid');
    let squares = [], width = 4, score = 0;
    let scoreDisplay = document.querySelector('#score');
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            let square = document.createElement('div');
            square.className = 'box';
            square.innerText = 0;
            grid.appendChild(square);
            squares.push(square);
        }
        generate()
        generate()
    }
//==========================
    function generate() {
        let twoOfour = Math.floor(Math.random() * 6);
        let randomNumber = Math.floor(Math.random() * squares.length);
        if(squares[randomNumber].innerText == 0) {
            squares[randomNumber].innerText = (twoOfour < 4)? 2: 4; 
            checkForGameOver();
        }
        else generate();
        for(elem of squares) {
            if(elem.innerText == 0)
                elem.style.color = 'rgb(78, 33, 75)';
            else 
                elem.style.color = 'white';
        }
    }
    //===============================
    function control(e) {
        if(e.keyCode === 37) {
        keyLeft()
        } else if (e.keyCode === 38) {
        keyUp()
        } else if (e.keyCode === 39) {
        keyRight()
        } else if (e.keyCode === 40) {
        keyDown()
        }
    }
  document.addEventListener('keyup', control);
  function keyUp() {
      moveUp();
      combineColumn();
      moveUp();
      generate();
  }
  function keyDown() {
      moveDown();
      combineColumn();
      moveDown();
      generate();
  }
  function keyLeft() {
      moveLeft();
      combineRow();
      moveLeft();
      generate();
  }
  function keyRight() {
      moveLeft(false);
      combineRow();
      moveLeft(false);
      generate();
  }
  function moveUp() {
    for (let i=0; i < 4; i++) {
        let column = [];
      for(let k = 0; k < 4; k++)
          column.push(parseInt(squares[i + (width * k)].innerText));
      let filteredColumn = column.filter(num => num)
      let missing = 4 - filteredColumn.length
      let zeros = Array(missing).fill(0)
      let newColumn = filteredColumn.concat(zeros)
      for(let k = 0; k < 4; k++)
          squares[i + (width * k)].innerText = newColumn[k];
    }
  }

  function moveDown() {
    for (let i=0; i < 4; i++) {
        let column = [];
        for(let k = 0; k < 4; k++)
            column.push(Number(squares[i + (width * k)].innerText));
      let filteredColumn = column.filter(num => num)
      let missing = 4 - filteredColumn.length
      let zeros = Array(missing).fill(0)
      let newColumn = zeros.concat(filteredColumn)
        for(let k = 0; k < 4; k++)
            squares[i + (width * k)].innerText = newColumn[k];
    }
  }

  function moveLeft(left = true) {
    for (let i=0; i < 16; i++) {
      if (i % 4 === 0) {
          let row = [];
          for(let k = 0; k < 4; k++) 
            row.push(parseInt(squares[i + k].innerText));
        let filteredRow = row.filter(num => num)
        let missing = 4 - filteredRow.length
        let zeros = Array(missing).fill(0)
        let newRow = left? filteredRow.concat(zeros): 
                        zeros.concat(filteredRow);
           for(let k = 0; k < 4; k++)
             squares[i +k].innerText = newRow[k];
      }
    }
  }

  // function moveRight() {
  //   for (let i=0; i < 16; i++) {
  //     if (i % 4 === 0) {
  //         let row = [];
  //         for (let k = 0; k < 4; k++)
  //           row.push(+squares[i + k].innerText);
  //       let filteredRow = row.filter(num => num)
  //       let missing = 4 - filteredRow.length
  //       let zeros = Array(missing).fill(0)
  //       let newRow = zeros.concat(filteredRow)
  //         for (let k = 0; k < 4; k++)
  //           squares[i + k].innerText = newRow[k];
  //     }
  //   }
  // }

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
  function addColors(){
      for(box of squares){
          switch (box.innerText) {
              case '0': box.style.backgroundColor = 'rgb(78, 33, 75)';
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
function checkForGameOver() {
    let zeros = 0
    for (let i=0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) {
        zeros++
      }
    }
    if(zeros == 1) {
        combineColumn();
        moveLeft();
        combineRow();
        moveUp();
    }
    if (zeros === 0) {
      document.querySelector('#score-container h2').innerHTML = 'You LOSE'
      document.removeEventListener('keyup', control);
      setTimeout(() => clear(), 3000);
      let name = prompt('Enter Your name');
      if(name !== "") 
      localStorage.setItem(name, score);
    }
  }
  function checkForWin() {
    for (let i=0; i < squares.length; i++) {
      if (squares[i].innerHTML == 2048) {
        resultDisplay.innerHTML = 'You WIN'
        document.removeEventListener('keyup', control)
        setTimeout(() => clear(), 3000)
      }
    }
  }











    createBoard();
});