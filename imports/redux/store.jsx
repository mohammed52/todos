import TodosCombinedReducers from './reducers'
import { createStore, applyMiddleware } from 'redux'

import logger from 'redux-logger'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
// import { getBoardFromSize, getRandomisedNewState, getBlankBoardFromSize } from './components/helpers/helpers';

const middleware = applyMiddleware(promise(), thunk, logger())
// const middleware = applyMiddleware(promise(), thunk)

const sampleStore = {
        backgroundColor: "lightgrey"
}

let store = createStore(TodosCombinedReducers, sampleStore, middleware)

export default store;