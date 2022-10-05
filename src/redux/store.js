import {legacy_createStore ,combineReducers} from 'redux'
import {CollapsedReducer} from './reducers/CollapsedReducer'
const reducer = combineReducers({
    CollapsedReducer
})
const store = legacy_createStore(reducer)
export default store