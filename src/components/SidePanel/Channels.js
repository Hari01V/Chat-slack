import React, { useEffect, useState } from "react";
import { Icon, Input, Menu, Modal, Form, Button } from "semantic-ui-react";

import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import firebase from "../../firebase";

const Channels = (props) => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [channelInput, setChannelInput] = useState({});
  const [firstLoad, setFirstLoad] = useState(true);
  const [activeChannel, setActiveChannel] = useState('');

  let { currentUser } = props;

  useEffect(() => {
    addListeners();
  }, []);

  useEffect(() => {
    setFirstChannel();
  }, [channels])

  const addListeners = () => {
    // Basically - assigning the array was copying the reference - and 
    // react wouldn't see that as a change - since the ref to the array 
    // isn't being changed - only content within it.
    let loadedChannels = [];
    firebase.database().ref('channels').on('child_added', snap => {
      let newLoadedChannels = [...loadedChannels, snap.val()];
      loadedChannels = newLoadedChannels;
      setChannels(newLoadedChannels);
    });
  }

  const setFirstChannel = () => {
    if (firstLoad) {
      if (channels.length > 0) {
        props.setCurrentChannel(channels[0]);
        setActiveChannel(channels[0].id);
        setFirstLoad(false);
      }
    }
  }

  const openModal = () => {
    setModal(true);
  }
  const closeModal = () => {
    setModal(false);
  }

  const handleChange = (event) => {
    setChannelInput({
      ...channelInput,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isFormValid(channelInput)) {
      addChannel();
    }
  }

  const isFormValid = (inputs) => {
    let { channelName, channelDetails } = inputs;
    return channelName && channelDetails;
  }

  const addChannel = () => {
    const channelsRef = firebase.database().ref('channels');
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelInput.channelName,
      details: channelInput.channelDetails,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };

    channelsRef.child(key)
      .update(newChannel).then(() => {
        setChannelInput({ channelName: '', channelDetails: '' });
        closeModal();
        console.log("Channel Added");
      }).catch(err => {
        console.log(err);
      });
  }

  const displayChannels = (channels) => {
    return (
      <>
        {channels.length > 0 &&
          channels.map(channel => (
            <Menu.Item key={channel.id}
              onClick={() => changeChannel(channel)}
              name={channel.name}
              style={{ opacity: 0.7 }}
              active={channel.id === activeChannel}>
              # {channel.name}
            </Menu.Item>
          ))
        }
      </>
    )
  }

  const changeChannel = (channel) => {
    setActiveChannel(channel.id);
    props.setCurrentChannel(channel);
    props.setPrivateChannel(false);
  }

  return (
    <>
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>
          {` [${channels.length}]`} <Icon name="add" onClick={openModal} />
        </Menu.Item>
        {displayChannels(channels)}
      </Menu.Menu>
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input fluid
                label="Name of Channel"
                name="channelName"
                onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <Input fluid
                label="About the Channel"
                name="channelDetails"
                onChange={handleChange} />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={handleSubmit}>
            <Icon name="checkmark" /> Add
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default connect(
  null,
  {
    setCurrentChannel,
    setPrivateChannel
  }
)(Channels);