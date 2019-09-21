import * as React from "react";
import {TileVisual} from "./TileVisual";
import {Tile} from "../types/Tile";

export class ExampleHandVisual extends React.Component {
    getTile(tile: Tile) {
        return (
            <TileVisual tile={tile} isTsumo={false} isDiscard={false} selectable={false} hidden={false}/>
        )
    }

    render() {
     return (
         <div className={'hand hand--example'}>
             {this.getTile({value: 7, suit: 3})}
             {this.getTile({value: 6, suit: 3})}
             {this.getTile({value: 5, suit: 3})}
             {this.getTile({value: 4, suit: 3})}
             {this.getTile({value: 3, suit: 3})}
             {this.getTile({value: 2, suit: 3})}
             {this.getTile({value: 1, suit: 3})}

             {this.getTile({value: 9, suit: 2})}
             {this.getTile({value: 1, suit: 2})}
             {this.getTile({value: 9, suit: 1})}
             {this.getTile({value: 1, suit: 1})}
             {this.getTile({value: 9, suit: 0})}
             {this.getTile({value: 1, suit: 0})}
         </div>
     )
    }
}