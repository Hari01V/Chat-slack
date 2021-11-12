import React, { useEffect, useState } from "react";
import { Segment, Button, Input } from "semantic-ui-react";

import firebase from '../../firebase';

export const MessageForm = (props) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState(props.currentChannel);
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  }

  const createMessage = () => {
    return {
      content: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    }
  }

  const sendMessage = () => {
    const { messagesRef } = props;

    if (message) {
      setIsLoading(true);
      messagesRef.child(channel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setIsLoading(false);
          setMessage('');
          setErrors([]);
        }).catch(err => {
          console.log(err);
          setIsLoading(false);
          setErrors([...errors, err]);
        })
    } else {
      setErrors([...errors, { message: 'Add a message' }])
    }
  }

  return (
    <Segment className="message__form">
      <Input fluid name="message"
        style={{ marginBottom: 'o.7em' }}
        label={<Button icon={'add'} />}
        labelPosition="left"
        className={
          errors.some(err => err.message.includes('message')) ? 'error' : ''
        }
        placeholder="Write your message"
        onChange={handleChange}
        value={message} />
      <Button.Group icon widths="2">
        <Button
          onClick={sendMessage}
          color="orange"
          content="Add Reply"
          disabled={isLoading}
          labelPosition="left"
          icon="edit" />
        <Button color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload" />
      </Button.Group>
    </Segment>
  )
}