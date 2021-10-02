import React, { useContext } from "react";
import "./center.scss";
import { TokenUserContext } from "../../App/App";
import FriendListItem from "../FriendList/FriendListItem";

export default function CenterFriends() {
  const { userState } = useContext(TokenUserContext);
  const [user] = userState;

  const parsedFriends =
    user.user &&
    user.friends.map((friend) => (
      <FriendListItem
        key={friend.id}
        friend_first_name={friend.friend_first_name}
        friend_last_name={friend.friend_last_name}
        friend_email={friend.friend_email}
      />
    ));
  return (
    <div className="center container">
      <h2>
        {user.user ? user.user.first_name : ""}{" "}
        {user.user ? user.user.last_name : ""}'s Friends
      </h2>
      <ul className="friendsContainer">{user.user ? parsedFriends : ""}</ul>
    </div>
  );
}
