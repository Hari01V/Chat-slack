import React, { useState, useEffect } from "react";
import { Segment, Comment, SearchResults } from 'semantic-ui-react';

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
  const [numUniqueUsers, setNumUniqueUsers] = useState('-');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [privateChannel, setPrivateChannel] = useState(props.isPrivateChannel);
  const [privateMessagesRef, setPrivateMessagesRef] = useState(firebase.database().ref('privateMessages'));

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
    const ref = getMessagesRef();
    ref.child(channelId)
      .on('child_added', snap => {
        let newLoadedMessages = [...loadedMessages, snap.val()];
        loadedMessages = newLoadedMessages;
        setMessages(newLoadedMessages);
        setMessagesLoading(false);

        countUniqueUsers(loadedMessages);
      });
  }

  const getMessagesRef = () => {
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  const displayMessages = (msgs) => (
    msgs.length > 0 && msgs.map(msg => (
      <Message key={msg.timestamp}
        message={msg}
        user={user} />
    ))
  )

  const displayChannelName = (channel) => {
    return channel ? `${privateChannel ? '@' : '#'} ${channel.name}` : "";
  }

  const countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const numUniqueUsers = `${uniqueUsers.length} ${uniqueUsers.length > 1 ? 'Users' : 'User'}`;
    setNumUniqueUsers(numUniqueUsers);
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);
  }

  useEffect(() => {
    if (searchLoading) {
      handleSearchMessages();
    }
  }, [searchTerm, searchLoading]);

  const handleSearchMessages = () => {
    const channelMessages = [...messages];
    const regex = new RegExp(searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(searchResults);
    setTimeout(() => {
      setSearchLoading(false);
    }, 800);
  }

  return (
    <>
      <MessagesHeader
        channelName={displayChannelName(channel)}
        numUniqueUsers={numUniqueUsers}
        handleSearchChange={handleSearchChange}
        searchLoading={searchLoading}
        privateChannel={privateChannel} />
      <Segment>
        <Comment.Group className="messages">
          {searchTerm ? displayMessages(searchResults) : displayMessages(messages)}
          {/* {displayMessages(messages)} */}
        </Comment.Group>
      </Segment>
      <MessageForm messagesRef={messagesRef}
        currentChannel={channel}
        currentUser={user}
        isPrivateChannel={privateChannel}
        getMessagesRef={getMessagesRef} />
    </>
  )
}