import { createSlice } from '@reduxjs/toolkit'

export const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    showCompletedTodos: true,
  },
  reducers: {
    toggleShowCompletedTodos: state => {
      state.showCompletedTodos = !state.showCompletedTodos
    },
  }
})

export const {
  toggleShowCompletedTodos,
} = todosSlice.actions

export default todosSlice.reducer
