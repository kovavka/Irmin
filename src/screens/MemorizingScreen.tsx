import * as React from "react";
import {TileVisual} from "../components/TileVisual";
import {Tile} from "../types/Tile";
import discard from '../img/tile-discard.svg';
import {HandVisual} from '../components/HandVisual'
import {DiscardVisual} from '../components/DiscardVisual'

type DiscardState = {
    tiles: Tile[]
}

export class MemorizingScreen extends React.Component {

    // constructor(props: DiscardState) {
    //     super(props)
    // }



    render() {
        return (
            <div>
                <HandVisual/>
            </div>
        )
    }
}