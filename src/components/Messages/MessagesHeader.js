import React from "react";
import { Segment, Header, Input, Icon } from "semantic-ui-react";

export const MessagesHeader = (props) => {
  const { channelName, numUniqueUsers, handleSearchChange, searchLoading } = props;

  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left"
        style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          <Icon name={"star outline"} color="black" />
        </span>
        <Header.Subheader>{numUniqueUsers}</Header.Subheader>
      </Header>

      <Header floated="right">
        <Input size="mini" icon="search"
          loading={searchLoading}
          onChange={handleSearchChange}
          name="searchTerm" placeholder="Search Messages" />
      </Header>
    </Segment>
  )
}