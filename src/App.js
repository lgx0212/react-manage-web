import './App.css';
import {useRoutes} from 'react-router-dom'
import finishElements  from './routers';
import {Provider} from 'react-redux'
import store from './redux/store';
function App() {
  const elements = useRoutes(finishElements)
  return <Provider store={store}>
    <>
      {elements}
    </>
  </Provider>
}

export default App;
