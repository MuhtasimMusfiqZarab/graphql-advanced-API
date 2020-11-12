import { GraphQLServer } from 'graphql-yoga';
import Comment from './resolvers/Comment';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import Query from './resolvers/Query';
import User from './resolvers/User';

//import the databse
import db from './db';

//create new instance for graphql server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Comment,
    Post,
    User,
  },
  context: {
    //define the things we want to set up on context
    db,
  },
});

//start the server on localhost 4000
server.start(() => console.log('The server is running!'));
