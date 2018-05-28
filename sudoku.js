// Javascript for sudoku solver
// By Skyclad
// Start Date: May 19 2018
var SUDOKU_NUMBER = 81;
var NINE = 9;
var THREE = 3;

function changeNumberBy1() {
  this.innerHTML = (parseInt(this.innerHTML) + 1) % 10;
  fadeFor0(this);
  //console.log(this.innerHTML);
}

function fadeFor0(elem) {
  if (elem.innerHTML == "0") {
    elem.style.color = "#DDDDDD";
  }
  else {
    elem.style.color = "black";
  }
}

// board data structure: (Java-like, omit unnecessary modifiers)
/*
   class Board {
   List<List<Cell>> cells;

   Board() {
   cells = new ArrayList<ArrayList<Cell>>(9);
   for (int i = 0; i < 9; ++i) {
   cells[i] = new ArrayList<Cell>(9);
   for (int j = 0; j < 9; ++j) {
   cells[i][j] = new Cell();
   }
   }
   }
   }

   class Cell {
   Integer cellNum;
   boolean[] candidates;

   Cell() {
   cellNum = null;
   candidates = new boolean[9];
   for (int i = 0; i < 9; ++i) {
   candidates[i] = false;
   }
   }
   }
 */

function getBoard()
{
  var board = {};
  //board.cells = ;
  board.cells = new Array(NINE);
  for (var i = 0; i < NINE; ++i)
  {
    board.cells[i] = new Array(NINE);
    for (var j = 0; j < NINE; ++j)
    {
      board.cells[i][j] = {};
      board.cells[i][j].cellNum = 0;
      board.cells[i][j].candidates = new Array(NINE);
      for (var k = 0; k < NINE; ++k)
      {
        board.cells[i][j].candidates[k] = true;
      }
    }
  }
  var cells = document.getElementsByClassName("cell");
  for (var i = 0; i < SUDOKU_NUMBER; ++i)
  {
    var id = cells[i].getAttribute("id");
    var row = parseInt(id[1]);
    var col = parseInt(id[3]);
    var cellNum = parseInt(cells[i].innerHTML);
    //console.log("row = " + row);
    //console.log("col = " + col);
    //console.log("content = " + cellNum);
    board.cells[row - 1][col - 1].cellNum = cellNum;
  }
  return board;
}

function setBoard(board)
{
  var cells = document.getElementsByClassName("cell");
  for (var i = 0; i < SUDOKU_NUMBER; ++i)
  {
    var id = cells[i].getAttribute("id");
    var row = parseInt(id[1]);
    var col = parseInt(id[3]);
    //var cellNum = parseInt(cells[i].innerHTML);
    //console.log("row = " + row);
    //console.log("col = " + col);
    //console.log("content = " + cellNum);
    //ret[row - 1][col - 1] = cellNum;
    cells[i].innerHTML = board.cells[row - 1][col - 1].cellNum;
    fadeFor0(cells[i]);
  }
}

function printBoard(board)
{
  for (var i = 0; i < NINE; ++i)
  {
    for (var j = 0; j < NINE; ++j)
    {
      var line = "row: " + (i + 1);
      line = line + " " + "col: " + (j + 1);// + board.cells[i][j].cellNum;
      line = line + " " + "cellNum: " + board.cells[i][j].cellNum;
      console.log(line);
      var line2 = "can: " + board.cells[i][j].candidates;
      console.log(line2);
    }
  }
}

function wipeOutCandidates(board, i, j)
{
  for (var k = 0; k < NINE; ++k)
  {
    board.cells[i][j].candidates[k] = false;
  }
}

function constructSameGroup(i, j)
{
  var ret = new Array(NINE);
  var groupRowBase = Math.floor(i / THREE) * THREE;
  var groupColBase = Math.floor(j / THREE) * THREE;
  for (var ii = 0; ii < THREE; ++ii)
  {
    for (var jj = 0; jj < THREE; ++jj)
    {
      var rcObj = {};
      rcObj.row = groupRowBase + ii;
      rcObj.col = groupColBase + jj;
      ret[THREE * ii + jj] = rcObj;
    }
  }
  return ret;
}

function constructCandidates(board)
{
  // runs only once
  for (var i = 0; i < NINE; ++i)
  {
    for (var j = 0; j < NINE; ++j)
    {
      if (board.cells[i][j].cellNum != 0)
      {
        // this cell itself does not have candidates anymore
        wipeOutCandidates(board, i, j);
      }
      else
      {
        // inspect the same row
        for (var jj = 0; jj < NINE; ++jj)
        {
          if (jj != j && board.cells[i][jj].cellNum != 0)
          {
            board.cells[i][j].candidates[board.cells[i][jj].cellNum - 1] = false;
          }
        }
        // inspect the same column
        for (var ii = 0; ii < NINE; ++ii)
        {
          if (ii != i && board.cells[ii][j].cellNum != 0)
          {
            board.cells[i][j].candidates[board.cells[ii][j].cellNum - 1] = false;
          }
        }
        // inspect the same group
        var groupList = constructSameGroup(i, j);
        for (var kk = 0; kk < NINE; ++kk)
        {
          if (groupList[kk].row != i && groupList[kk].col != j && board.cells[groupList[kk].row][groupList[kk].col].cellNum != 0)
          {
            board.cells[i][j].candidates[board.cells[groupList[kk].row][groupList[kk].col].cellNum - 1] = false;
          }
        }
      }
    }
  }
}

function solve(board)
{
  constructCandidates(board);
}

function clickSolve()
{
  var board = getBoard();
  printBoard(board);
  //solve(board);
  setBoard(board);
  //console.log("I am too stupid to solve this");
  //alert("I am too stupid to solve this");
}

window.onload = function ()
{
  var cells = document.getElementsByClassName("cell");
  //assign board: do later
  //var ret = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
  //[0, 0, 0, 0, 0, 0, 0, 0, 0],
  //[0, 0, 0, 0, 0, 0, 0, 0, 0],
  //[0, 0, 0, 0, 0, 0, 0, 0, 0],
  //[0, 0, 0, 0, 0, 0, 0, 0, 0],
  //[0, 0, 0, 0, 0, 0, 0, 0, 0],
  //[0, 0, 0, 0, 0, 0, 0, 0, 0],
  //[0, 0, 0, 0, 0, 0, 0, 0, 0],
  //[0, 0, 0, 0, 0, 0, 0, 0, 0]];
  for (var i = 0; i < SUDOKU_NUMBER; ++i)
  {
    cells[i].onclick = changeNumberBy1;
    fadeFor0(cells[i]);
  }
}
