// Javascript for sudoku solver
// Logic part: solve the sudoku with a given board, reports 
//    if it is solved, not able to be solved with known
//    techniques, contradictory initial setting, wrong initial
//    setting with multiple solutions, etc.
// By Skyclad
// Start Date: May 19 2018
var SUDOKU_NUMBER = 81;
var NINE = 9;
var THREE = 3;

function printCandidates(board)
{
  for (var i = 0; i < NINE; ++i)
  {
    for (var j = 0; j < NINE; ++j)
    {
      var line = "row: " + (i + 1);
      line = line + " " + "col: " + (j + 1);// + board.cells[i][j].cellNum;
      line = line + " " + "cellNum: " + board.cells[i][j].cellNum;
      console.log(line);
      if (board.cells[i][j].cellNum == 0)
      {
        var line2 = "candidates:";
        for (var k = 0; k < NINE; ++k)
        {
          line2 = line2 + " " + (board.cells[i][j].candidates[k] ? (k + 1) : "_");
        }
        console.log(line2);
      }
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
  // could run validate first time here
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
        var gList = constructSameGroup(i, j);
        for (var kk = 0; kk < NINE; ++kk)
        {
          if (gList[kk].row != i && gList[kk].col != j && board.cells[gList[kk].row][gList[kk].col].cellNum != 0)
          {
            board.cells[i][j].candidates[board.cells[gList[kk].row][gList[kk].col].cellNum - 1] = false;
          }
        }
      }
    }
  }
}

function isSolved(board)
{
  for (var i = 0; i < NINE; ++i)
  {
    for (var j = 0; j < NINE; ++j)
    {
      if (board.cells[i][j].cellNum == 0)
      {
        return false;
      }
    }
  }
  return true;
}

function fillInANumber(board, i, j, option)
{
  board.cells[i][j].cellNum = option;
  // wipe out candidates of this cell
  wipeOutCandidates(board, i, j);
  // remove this number from candidates of the same row, col and group
  // inspect the same row
  for (var jj = 0; jj < NINE; ++jj)
  {
    if (jj != j)
    {
      board.cells[i][jj].candidates[option - 1] = false;
    }
  }
  // inspect the same column
  for (var ii = 0; ii < NINE; ++ii)
  {
    if (ii != i)
    {
      board.cells[ii][j].candidates[option - 1] = false;
    }
  }
  // inspect the same group
  var gList = constructSameGroup(i, j);
  for (var kk = 0; kk < NINE; ++kk)
  {
    if (gList[kk].row != i && gList[kk].col != j)
    {
      board.cells[gList[kk].row][gList[kk].col].candidates[option - 1] = false;
    }
  }
}

function rule1_OnlyCandidate(board)
{
  var changed = false;
  for (var i = 0; i < NINE; ++i)
  {
    for (var j = 0; j < NINE; ++j)
    {
      // inspect one cell
      if (board.cells[i][j].cellNum == 0)
      {
        var candis = 0;
        var option = 0;
        for (var k = 0; k < NINE; ++k)
        {
          if (board.cells[i][j].candidates[k])
          {
            candis += 1;
            option = k + 1;
          }
        }
        if (candis == 1)
        {
          changed = true;
          // fill in the only candidate
          fillInANumber(board, i, j, option);
        }
      }
    }
  }
  if (!changed)
  {
    changed = changed || rule2_OnlyCell(board);
  }
  return changed;
}

function rule2_OnlyCell(board)
{
  var changed = false;
  // outer loop over candidates
  for (var k = 0; k < NINE; ++k)
  {
    // inspect every group
    for (var gi = 0; gi < THREE; ++gi)
    {
      for (var gj = 0; gj < THREE; ++gj)
      {
        var gList = constructSameGroup(gi * THREE, gj * THREE);
        var i = NINE;
        var j = NINE;
        var kCount = 0;
        for (var l = 0; l < NINE; ++l)
        {
          if (board.cells[gList[l].row][gList[l].col].candidates[k])
          {
            kCount += 1;
            i = gList[l].row;
            j = gList[l].col;
          }
        }
        if (kCount == 1)
        {
          changed = true;
          fillInANumber(board, i, j, k + 1);
        }
      }
    }
    // inspect every row
    for (var i = 0; i < NINE; ++i)
    {
      var j = NINE;
      var kCount = 0;
      for (var jj = 0; jj < NINE; ++jj)
      {
        if (board.cells[i][jj].candidates[k])
        {
          kCount += 1;
          j = jj;
        }
      }
      if (kCount == 1)
      {
        changed = true;
        fillInANumber(board, i, j, k + 1);
      }
    }
    // inspect every column
    for (var j = 0; j < NINE; ++j)
    {
      var i = NINE;
      var kCount = 0;
      for (var ii = 0; ii < NINE; ++ii)
      {
        if (board.cells[ii][j].candidates[k])
        {
          kCount += 1;
          i = ii;
        }
      }
      if (kCount == 1)
      {
        changed = true;
        fillInANumber(board, i, j, k + 1);
      }
    }
  }
  //if (!changed)
  //{
    //changed = changed || rule3_NOT_IMPLEMENTED(board);
  //}
  return changed;
}

function solve(board)
{
  console.log("SOLVE001: Constructing candidates");
  constructCandidates(board);
  printCandidates(board);
  var changed = true;
  while (changed)
  {
    changed = rule1_OnlyCandidate(board);
    // subsequent rules are called in a chain
  }
  return isSolved(board);
}
