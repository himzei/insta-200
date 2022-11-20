import { gql } from "apollo-server";

export default gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    bio: String
    avatar: Upload
    photos: [Photo]
    createdAt: String!
    updatedAt: String!
    followers: [User]
    following: [User]
    totalFollowing: Int!
    totalFollowers: Int!
    isMe: Boolean!
    isFollowing: Boolean!
  }
`;
