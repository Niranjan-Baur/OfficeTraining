import {applyMiddleware, createStore} from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from "./Reducer"

const configureStore = require('@reduxjs/toolkit').configureStore


const middlewareEnhancer = composeWithDevTools(
    applyMiddleware(thunk)
)

const store = createStore(rootReducer,middlewareEnhancer)
// const store = configureStore(rootReducer)
    
export default store;
