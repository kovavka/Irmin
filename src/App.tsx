import React from 'react';
import './App.css';

import {HandService} from "./utils/HandService";
import {Discard} from "./components/Discard";

const App: React.FC = () => {

    const service = new HandService()
    service.generate()

    let discardTiles = service.getHand()

   return (
    <div className="App">

      <div className={'page-header'}>
        <div className={'page-header__title'}></div>
      </div>

        <Discard tiles={discardTiles}/>
    </div>
  );
}

export default App;
