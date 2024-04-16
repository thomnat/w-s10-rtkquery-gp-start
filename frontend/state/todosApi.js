import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todosApi = createApi({
  //todosApi will end up included in the list of reducers, so the reducerPath property is the name of this reducer that we will use to reference this later
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9009/api/" }), //this baseQuery property contains the piece of URL each endpoint contains so we don't have to repeat ourselves and can just have the added piece of URL within each endpoint instead of "http://localhost:9009/api/todos" with obviously replacing the todos part with the various endpoints
  tagTypes: ["Todos"],
  endpoints: (build) => ({
    getTodos: build.query({
      //each name is descriptive of the job each endpoint performs
      query: () => "todos", //a method called query, which returns a string with the URL of interest
      providesTags: ["Todos"], //successful GET request attaches this particular tag to the data
    }), //we use build.query to construct the endpoints that have no intention of altering the state of the server
    toggleTodo: build.mutation({
      //this mutation will also need a query function but in this case its going to take a single argument, which is an object with the desired id and the desired todo and its going to return an object with some properties
      query: ({ id, todo }) => ({
        //note how the query takes as its argument the exact same shape we plan to supply from the component, in this case Todos.js
        url: `todos/${id}`,
        method: "PUT",
        body: todo,
      }),
      invalidatesTags: ["Todos"], //then successful PUT request invalidates any data that has that tag and triggers an automatic refetch 
    }), //since the ability to toggle a todo as complete changes the todo on the server we use build.mutation
    createTodo: build.mutation({
      query: todo => ({
        url: "todos",
        method: "POST",
        body: todo
      }),
      invalidatesTags: ["Todos"]
    }), //creating a new todo is also changing the todos in the server so again we use build.mutation
  }),
});

export const {
  useGetTodosQuery,
  useToggleTodoMutation,
  useCreateTodoMutation,
} = todosApi;
