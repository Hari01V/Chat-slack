import React, { useEffect, useState } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { v4 as uuidv4 } from 'uuid';

import firebase from '../../firebase';
import { FileModal } from "./FileModal";
import { ProgressBar } from "./ProgressBar";

export const MessageForm = (props) => {
  const { messagesRef } = props;

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState(props.currentChannel);
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const [errors, setErrors] = useState([]);
  const [modal, setModal] = useState(false);
  const [uploadState, setUploadState] = useState('');
  const [uploadTask, setUploadTask] = useState(null);
  const [storageRef, setStorageRef] = useState(firebase.storage().ref());
  const [percentUploaded, setPercentUploaded] = useState(0);
  const [ref, setRef] = useState(null);
  const [pathToUpload, setPathToUpload] = useState(null);

  const openModal = () => {
    setModal(true);
  }

  const closeModal = () => {
    setModal(false);
  }

  const handleChange = (event) => {
    setMessage(event.target.value);
  }

  const createMessage = (fileUrl = null) => {
    const msg = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };
    if (fileUrl !== null) {
      msg['image'] = fileUrl;
    } else {
      msg['content'] = message;
    }
    return msg;
  }

  const sendMessage = () => {
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

  const uploadFile = (file, metadata) => {
    const pathToUpload = channel.id;
    const ref = messagesRef;
    setPathToUpload(pathToUpload);
    setRef(ref);
    const filePath = `chat/public/${uuidv4()}.jpg`;
    setUploadState('uploading');
    setUploadTask(storageRef.child(filePath).put(file, metadata));
  }

  useEffect(() => {
    if (uploadTask) {
      uploadTask.on('state_changed', snap => {
        const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        setPercentUploaded(percentUploaded);
      }, err => {
        console.log(err);
        setErrors([...errors, err]);
        setUploadState('error');
        setUploadTask(null);
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
          sendFileMessage(downloadUrl, ref, pathToUpload);
        }).catch(err => {
          console.log(err);
          setErrors([...errors, err]);
          setUploadState('error');
          setUploadTask(null);
        })
      });
    }
  }, [uploadTask]);

  const sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref.child(pathToUpload).push()
      .set(createMessage(fileUrl))
      .then(() => {
        setUploadState('done');
      }).catch(err => {
        console.log(err);
        setErrors([...errors, err]);
      })
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
          onClick={openModal}
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload" />
      </Button.Group>
      <FileModal modal={modal}
        closeModal={closeModal}
        uploadFile={uploadFile} />
      <ProgressBar uploadState={uploadState}
        percentUploaded={percentUploaded} />
    </Segment>
  )
}