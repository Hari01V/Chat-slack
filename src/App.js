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
  const { currentUser, currentChannel } = props;

  return (
    <Grid columns="equal" className="app" style={{ background: '#eee' }}>
      <ColorPanel />
      <SidePanel
        key={currentUser && currentUser.uid}
        currentUser={currentUser} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser} />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
}

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel
  }
}

export default connect(mapStateToProps)(App);
