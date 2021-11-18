import React, { useEffect, useState } from "react";
import { Menu, Icon } from "semantic-ui-react";

import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import firebase from "../../firebase";

const DirectMessages = (props) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(props.currentUser);
  const [usersRef, setUsersRef] = useState(firebase.database().ref('users'));
  const [connectedRef, setConnectedRef] = useState(firebase.database().ref('.info/connected'));
  const [presenceRef, setPresenceRef] = useState(firebase.database().ref('presence'));
  const [changedUsers, setChangedUsers] = useState(false);
  const [activeChannel, setActiveChannel] = useState('');

  useEffect(() => {
    if (user) {
      addListeners(user.uid);
    }
  }, []);

  useEffect(() => {
    if (users.length > 0 && !changedUsers) {
      if (user) {
        listeners(user.uid);
      }
      setChangedUsers(true);
    }
  }, [users]);

  const changeChannel = (user) => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    props.setCurrentChannel(channelData);
    props.setPrivateChannel(true);
    setActiveChannel(user.uid);
  }

  const getChannelId = (userId) => {
    const currentUserId = user.uid;
    return userId < currentUserId ?
      `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
  }

  const addListeners = (id) => {
    let loadedUsers = [];
    usersRef.on('child_added', snap => {
      if (id !== snap.key) {
        let user = snap.val();
        user['uid'] = snap.key;
        user['status'] = 'offline';

        let newLoadedUsers = [...loadedUsers, user];
        loadedUsers = newLoadedUsers;
        setUsers(newLoadedUsers);
      }
    });

    // connectedRef.on('value', snap => {
    //   if (snap.val()) {
    //     const ref = presenceRef.child(id);
    //     ref.set(true);
    //     ref.onDisconnect().remove(err => {
    //       if (err !== null) {
    //         console.log(err);
    //       }
    //     })
    //   }
    // });

    // presenceRef.on('child_added', snap => {
    //   if (id !== snap.key) {
    //     console.log(users);
    //     addStatusToUser(snap.key);
    //   }
    // });

    // presenceRef.on('child_removed', snap => {
    //   if (id !== snap.key) {
    //     console.log(users);
    //     addStatusToUser(snap.key, false);
    //   }
    // });
  }

  const listeners = (id) => {
    connectedRef.on('value', snap => {
      if (snap.val()) {
        const ref = presenceRef.child(id);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.log(err);
          }
        })
      }
    });

    presenceRef.on('child_added', snap => {
      if (id !== snap.key) {
        addStatusToUser(snap.key);
      }
    });

    presenceRef.on('child_removed', snap => {
      if (id !== snap.key) {
        addStatusToUser(snap.key, false);
      }
    });
  }

  const addStatusToUser = (userId, connected = true) => {
    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`;
      }
      return acc.concat(user);
    }, []);
    setUsers([...updatedUsers]);
  }

  const isUserOnline = (user) => {
    return user.status === 'online';
  }

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{' '}
        ({users.length})
      </Menu.Item>
      {users.map(user => (
        <Menu.Item
          key={user.uid}
          active={user.uid === activeChannel}
          onClick={() => { changeChannel(user) }}
          style={{ opacity: 0.7, fontStyle: 'italic' }}>
          <Icon name="circle"
            color={isUserOnline(user) ? 'green' : 'red'} />
          @ {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  )
}

export default connect(null, {
  setCurrentChannel,
  setPrivateChannel
})(DirectMessages);