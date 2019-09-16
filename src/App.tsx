import React from 'react';
import './App.css';
import {TempaiService} from "./utils/TempaiService";

const App: React.FC = () => {

  const service =  new TempaiService()
  let hand = ''

  var bStyle = {
    margin: '10px 0',
    width: '75px',
    height: '20px',
  };

  return (
    <div className="App">
      <header className="App-header">

        <input defaultValue={''} onChange={(e) => hand = e.target.value}/>
        <button style={bStyle}  onClick={() => console.log(service.hasTempai(hand))} />
      </header>
    </div>
  );
}

export default App;
