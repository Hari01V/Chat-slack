import React from 'react';
import './App.css';

import { Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { ColorPanel } from './components/ColorPanel/ColorPanel';
import { SidePanel } from './components/SidePanel/SidePanel';
import { Messages } from './components/Messages/Messages';
import { MetaPanel } from './components/MetaPanel/MetaPanel';

function App(props) {
  return (
    <Grid columns="equal" className="app" style={{ background: '#eee' }}>
      <ColorPanel />
      <SidePanel currentUser={props.currentUser} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
}

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser
  }
}

export default connect(mapStateToProps)(App);
