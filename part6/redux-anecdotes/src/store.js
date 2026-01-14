import { configureStore } from '@reduxjs/toolkit'
import storyReducer from './reducers/storyReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    stories: storyReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

export default store
