const typeDefs = `
  type Writer {
    name: String!
    born: Int
    volumeCount: Int!
    id: ID!
  }

  type Volume {
    title: String!
    published: Int!
    writer: Writer!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    volumeCount: Int!
    writerCount: Int!
    allVolumes(writer: String, genre: String): [Volume]!
    allWriters: [Writer]!
    me: User
  }

  type Mutation {
    addVolume(
      title: String!
      published: Int!
      writer: String!
      genres: [String]!
    ): Volume
    editWriter(
      name: String!,
      setBornTo: Int!
    ): Writer
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    volumeAdded: Volume!
  }
`;

module.exports = typeDefs;
