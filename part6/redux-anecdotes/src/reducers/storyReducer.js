import { createSlice } from '@reduxjs/toolkit'
import storyService from '../services/stories'

const storySlice = createSlice({
  name: 'stories',
  initialState: [],
  reducers: {
  });

export const { addVote, addAnecdote, setAnecdotes } = anecdoteSlice.actions;

export default anecdoteSlice.reducer;
