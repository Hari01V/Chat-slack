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
  const { currentUser, currentChannel, isPrivateChannel } = props;

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
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel} />
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
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel
  }
}

export default connect(mapStateToProps)(App);
