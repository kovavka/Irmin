import React from 'react'
import './App.less'
import {Main} from './screens/Main'
import {isMobile} from './services/Ulils'

const App: React.FC = () => {
    if (isMobile()) {
        document.querySelector('#root')!.classList.add('mobile')
    }

   return (
        <Main/>
  );
}

export default App;
