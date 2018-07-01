// Javascript for sudoku solver
// Controller part: get data from html page, put updated data
//    to html page, controls the behavior of each elements
// By Skyclad
// Start Date: May 19 2018
function changeNumberBy1() {
  this.innerHTML = (parseInt(this.innerHTML) + 1) % 10;
  fadeIf0(this);
  //console.log(this.innerHTML);
}

function fadeIf0(elem) {
  if (elem.innerHTML == "0") {
    elem.style.color = "#DDDDDD";
  }
  else {
    elem.style.color = "black";
  }
}

// board data structure: (Java-like, omit unnecessary modifiers)
/*
class Board
{
  List<List<Cell>> cells;

  Board()
  {
    cells = new ArrayList<ArrayList<Cell>>(9);
    for (int i = 0; i < 9; ++i)
    {
      cells[i] = new ArrayList<Cell>(9);
      for (int j = 0; j < 9; ++j)
      {
        cells[i][j] = new Cell();
      }
    }
  }
}

class Cell
{
  Integer cellNum;
  boolean[] candidates;

  Cell()
  {
    cellNum = null;
    candidates = new boolean[9];
    for (int i = 0; i < 9; ++i)
    {
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
    fadeIf0(cells[i]);
  }
}

function printBoard(board)
{
  for (var i = 0; i < NINE; ++i)
  {
    var line = "row: " + (i + 1);
    for (var j = 0; j < NINE; ++j)
    {
      line = line + " " + (board.cells[i][j].cellNum == 0 ? "_" : board.cells[i][j].cellNum);
    }
    console.log(line);
  }
}

function clickSolve()
{
  console.log("MAIN002: You clicked solve");
  var board = getBoard();
  console.log("MAIN003: Board successfully read");
  printBoard(board);
  var solved = solve(board);
  console.log("MAIN004: Setting board returned by solver");
  setBoard(board);
  if (solved)
  {
    alert("Great! Sudoku solved!");
  }
  else
  {
    alert("Sorry! I am too stupid to solve this! This is all I can do now...");
  }
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
    fadeIf0(cells[i]);
  }
  console.log("MAIN001: Initialized");
}
