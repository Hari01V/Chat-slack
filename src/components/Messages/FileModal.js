import React, { useState } from "react";
import { Modal, Input, Button, Icon } from 'semantic-ui-react';
import mime from 'mime-types';

export const FileModal = (props) => {
  const { modal, closeModal, uploadFile } = props;

  const [file, setFile] = useState(null);
  const [authorized, setAuthorized] = useState(['image/jpeg', 'image/png']);

  const addFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  }

  const sendFile = () => {
    if (file !== null) {
      if (isAuthorized(file.name)) {
        const metadata = {
          contentType: mime.lookup(file.name)
        };
        uploadFile(file, metadata);
        closeModal();
        clearFile();
      }
    }
  }

  const isAuthorized = (fileName) => {
    return authorized.includes(mime.lookup(fileName));
  }

  const clearFile = () => {
    setFile(null);
  }

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input fluid label="File types: jpg, png"
          name="file" type="file" onChange={addFile} />
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={sendFile}>
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  )
}