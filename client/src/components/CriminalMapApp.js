import React, { Component } from "react";
import configs from '../utils/config';
import CriminalActsMap from './CriminalActsMap';

export default class CriminalMapApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bounds: configs.startBounds,
    }
    this.onMove = this.onMove.bind(this);
  }
   
  onMove(newBounds) {
    this.setState({
      bounds: newBounds,
    });
  }

  render() {
    return (
      <CriminalActsMap action={this.onMove} config={configs}/>
    )
  }

}