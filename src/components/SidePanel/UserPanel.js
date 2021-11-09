import React, { useEffect, useState } from "react";
import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react';

import firebase from '../../firebase';

const UserPanel = (props) => {
  const [user, setUser] = useState(props.currentUser);

  // useEffect(() => {
  //   setUser({
  //     user: props.currentUser
  //   })
  // })

  const dropDownOptions = () => {
    return [
      {
        key: "user",
        text: <span>Signed in as <strong>{user.displayName}</strong></span>,
        disabled: true
      },
      {
        key: 'avatar',
        text: <span>Change Avatar</span>
      },
      {
        key: 'signout',
        text: <span onClick={handleSignOut}>Sign Out</span>
      }
    ]
  }

  const handleSignOut = () => {
    firebase.auth().signOut().then(() => {
      console.log('Signed Out');
    })
  }

  return (
    <Grid style={{ background: '#4c3c4c' }}>
      <Grid.Column>
        <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>
          <Header style={{ padding: '0.25em' }}
            as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={user.photoURL} spaced="right" avatar />
                  {user.displayName}
                </span>
              }
              options={dropDownOptions()} />
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  )
}

export default UserPanel;