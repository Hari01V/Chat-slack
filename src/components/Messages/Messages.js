import React, { useState, useEffect } from "react";
import { Segment, Comment } from 'semantic-ui-react';

import { MessagesHeader } from "./MessagesHeader";
import { MessageForm } from "./MessageForm";
import { Message } from './Message';
import firebase from '../../firebase';

export const Messages = (props) => {
  const [messagesRef, setMessagesRef] = useState(firebase.database().ref('messages'));
  const [channel, setChannel] = useState(props.currentChannel);
  const [user, setUser] = useState(props.currentUser);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    if (channel && user) {
      addListerners(channel.id);
    }
  }, [])

  const addListerners = (channelId) => {
    addMessageListener(channelId);
  }

  const addMessageListener = (channelId) => {
    // Basically - assigning the array was copying the reference - and 
    // react wouldn't see that as a change - since the ref to the array 
    // isn't being changed - only content within it.
    let loadedMessages = [];
    messagesRef.child(channelId)
      .on('child_added', snap => {
        let newLoadedMessages = [...loadedMessages, snap.val()];
        loadedMessages = newLoadedMessages;
        setMessages(newLoadedMessages);
        setMessagesLoading(false);
      });
  }

  const displayMessages = (msgs) => (
    msgs.length > 0 && msgs.map(msg => (
      <Message key={msg.timestamp}
        message={msg}
        user={user} />
    ))
  )

  return (
    <>
      <MessagesHeader />
      <Segment>
        <Comment.Group className="messages">
          {displayMessages(messages)}
        </Comment.Group>
      </Segment>
      <MessageForm messagesRef={messagesRef}
        currentChannel={channel}
        currentUser={user} />
    </>
  )
}