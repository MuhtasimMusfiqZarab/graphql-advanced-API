import { GraphQLServer } from 'graphql-yoga';

//Type definitions(also known as schema) -operations that can be performed on the api & the custom data types

const typeDefs = `
type Query {
  hello: String!
  name: String!
  location: String!
  bio: String!
}
`;

//Resolvers
const resolvers = {
  Query: {
    //here are all of the methods for all the queries
    hello() {
      return 'This is my first query!';
    },
    name() {
      return 'My Name is Zarab';
    },
    location() {
      return 'I am From Dhaka';
    },
    bio() {
      return 'I Am A Software Developer';
    },
  },
};

//create new instance for graphql server
const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

//start the server on localhost 4000
server.start(() => console.log('The server is running!'));
