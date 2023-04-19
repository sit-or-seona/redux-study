import { createStore } from "redux";

const ADD = "ADD";
const DELETE = "DELETE";

const addToDo = (text) => {
  return {
    type: ADD,
    text,
  };
};

const deleteToDo = (id) => {
  return {
    type: DELETE,
    id: parseInt(id),
  };
};

const reducer = (state = [], action) => {
  const getStorageToDo = JSON.parse(localStorage.getItem("toDos"));
  const setStorageToDo = (storage) =>
    localStorage.setItem("toDos", JSON.stringify(storage));

  if (localStorage.length === 0) {
    setStorageToDo([]);
  }

  switch (action.type) {
    case ADD:
      const addStorage = [
        {
          text: action.text,
          id: Date.now(),
        },
        ...getStorageToDo,
      ];
      setStorageToDo(addStorage);
      return getStorageToDo;
    case DELETE:
      const delStorage = getStorageToDo.filter((todo) => todo.id !== action.id);
      setStorageToDo(delStorage);
      return getStorageToDo;
    default:
      return state;
  }
};

const store = createStore(reducer);

export const actionCreators = {
  addToDo,
  deleteToDo,
};

export default store;
