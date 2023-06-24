import React from "react";
import { useRecoilValue } from "recoil";
import { filteredTodoListState } from "../recoil_state";
import TodoItem from "./TodoItem";
import TodoItemCreator from "./TodoItemCreator";

export default function TodoList() {
  const todoList = useRecoilValue(filteredTodoListState);

  return (
    <>
      <TodoItemCreator />
      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </>
  );
}
