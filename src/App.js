import React, { useState, useEffect } from "react";
import { Draggable, Droppable } from "react-drag-and-drop";

import { isEqual } from "lodash";

import "./App.css";

const isSolvable = (arr) => {
  let number_of_inv = 0;
  // get the number of inversions
  for (let i = 0; i < arr.length; i++) {
    // i picks the first element
    for (let j = i + 1; j < arr.length; j++) {
      // check that an element exist at index i and j, then check that element at i > at j
      if (arr[i] && arr[j] && arr[i] > arr[j]) number_of_inv++;
    }
  }
  // if the number of inversions is even
  // the puzzle is solvable
  return number_of_inv % 2 === 0;
};

const shuffle = (arr) => {
  return new Promise((resolve, reject) => {
    const copy = [...arr];
    // loop over the array
    for (let i = 0; i < copy.length; i++) {
      // for each index,i pick a random index j
      let j = parseInt(Math.random() * copy.length);
      // swap elements at i and j
      let temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    if (!isSolvable(copy)) {
      return shuffle(arr);
    } else {
      resolve(copy);
    }
  });
};

const sol = ["1", "2", "3", "4", "5", "6", "7", "8", ""];

function App() {
  const [list, setList] = useState(sol);
  const [emptyTileIndex, setEmptyTileIndex] = useState(
    list.findIndex((num) => num === "")
  );

  useEffect(() => {
    shuffle(list).then((res) => {
      setList(res);
      setEmptyTileIndex(res.findIndex((num) => num === ""));
    });
  }, []);

  const [dragaableIndexes, setDragaableIndexes] = useState([]);

  const getGameDimension = () => {
    let j = 0;
    let arr = [];
    for (let i = 0; i < 3; i++) {
      arr.push(list.slice(j, j + 3));
      j += 3;
    }

    return arr;
  };

  const getEmptyCell = () => {
    const emptyCellRow = Math.ceil((emptyTileIndex + 1) / 3);
    const emptyCellCol = 3 - (3 * emptyCellRow - (emptyTileIndex + 1));
    return [emptyCellRow - 1, emptyCellCol - 1];
  };

  const onDrop = ({ number }) => {
    const [tile, index] = number.split("-");
    const new_list = [];
    list.forEach((num, key) => {
      if (key === parseInt(index, 10)) {
        new_list.push("");
      } else if (key === emptyTileIndex) {
        new_list.push(tile);
      } else {
        new_list.push(num);
      }
    });
    setEmptyTileIndex(parseInt(index, 10));
    setList(new_list);
    if (isEqual(new_list, sol)) {
      alert("You have won");
    }
  };

  useEffect(() => {
    const [row, col] = getEmptyCell();
    const newDraggableList = [];

    const dimesion = getGameDimension();
    if (dimesion[row] && dimesion[row][col - 1])
      newDraggableList.push(dimesion[row][col - 1]);
    if (dimesion[row] && dimesion[row][col + 1])
      newDraggableList.push(dimesion[row][col + 1]);

    if (dimesion[row - 1]) newDraggableList.push(dimesion[row - 1][col]);
    if (dimesion[row + 1]) newDraggableList.push(dimesion[row + 1][col]);
    setDragaableIndexes(newDraggableList);
  }, [emptyTileIndex]);

  return (
    <div className="app">
      <h1>Sliding Tile Puzzle</h1>
      <div className="container">
        <ul>
          {list.map((num, index) => {
            if (num) {
              if (dragaableIndexes.indexOf(num) > -1) {
                return (
                  <Draggable
                    className="tiles"
                    key={num}
                    type="number"
                    data={`${num}-${index}`}
                  >
                    <li>{num}</li>
                  </Draggable>
                );
              }
              return (
                <li className="tiles" key={num}>
                  {num}
                </li>
              );
            }
            return (
              <Droppable
                types={["number"]} // <= allowed drop types
                onDrop={onDrop}
                className="empty tiles"
                key={num}
              >
                <li>{num}</li>
              </Droppable>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
