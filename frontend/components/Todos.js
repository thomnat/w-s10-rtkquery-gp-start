import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { toggleShowCompletedTodos } from "../state/todosSlice";
import { useGetTodosQuery, useToggleTodoMutation } from "../state/todosApi";

const StyledTodo = styled.li`
  text-decoration: ${(pr) => (pr.$complete ? "line-through" : "initial")};
  cursor: pointer;
`;

export default function Todo() {
  //rtk query. when we call the useGetTodosQuery hook it returns an object, and we want to pull a variable from that object called todos(todos to be specific but really just data), which obvi comes from the invocation of the useGetTodosQuery hook. todos will be undefined on first render of the component, and will become the collection of todos after the network request succeeds
  const { data: todos, isLoading: todosLoading, isFetching: todosRefreshing } = useGetTodosQuery();
  const [toggleTodo, { error: toggleError, isLoading: todosToggling }] = useToggleTodoMutation()//pulling toggleTodo from an array that comes back from invoking the hook
  // redux
  const showCompletedTodos = useSelector(
    (st) => st.todosState.showCompletedTodos
  );
  const dispatch = useDispatch();
  return (
    <div id="todos">
      <div className="error">{toggleError && toggleError.data.message}</div>
      <h3>Todos {(todosToggling || todosRefreshing) && 'being updated'}</h3>
      <ul>
        {
          todosLoading ? 'todos loading...' :
        todos?.filter((todo) => {
            return showCompletedTodos || !todo.complete;
          })
          .map((todo) => {
            const onToggle = () => {
              // for each todo we want to create a click handler called onToggle which is going to use a hypothetical function that doesnt yet exist in this module called toggleTodo. this toggleTodo function would take a single argument, but we need to supply two pieces of data --> the desired ID and an object with complete
              toggleTodo({ id: todo.id, todo: { complete: !todo.complete }}) //todo.id will become the number that will end up at the end of the endpoints url, ex: http://localhost:9009/api/todos/2, and the object { complete: !todo.complete } will become the payload for the put request
            };
            return (
              <StyledTodo onClick={onToggle} $complete={todo.complete} key={todo.id}>
                <span>
                  {todo.label}
                  {todo.complete && " ✔️"}
                </span>
              </StyledTodo>
            );
          })}
      </ul>
      <button onClick={() => dispatch(toggleShowCompletedTodos())}>
        {showCompletedTodos ? "Hide" : "Show"} completed todos
      </button>
    </div>
  );
}
