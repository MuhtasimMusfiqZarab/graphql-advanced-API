import { GraphQLServer } from 'graphql-yoga';

//Scalar Type-String,Boolean,Int,Float,ID

//Type definitions(also known as schema) -operations that can be performed on the api & the custom data types
const typeDefs = `
type Query {
  greeting(name: String):String!
  me: User!
  post:Post!
}
 
type User {
  id:ID!
  name:String!
  email:String!
  age:Int
}

type Post {
  id: ID!
  title:String!
  body:String!
  published:Boolean!
}
`;

//Resolvers
const resolvers = {
  Query: {
    //here are all of the methods for all the queries

    greeting(parent, args, context, info) {
      if (args.name) {
        return `Hello! ${args.name}`;
      }

      return `Hello!`;
    },

    me() {
      return {
        id: '123098',
        name: 'Zarab',
        email: 'musfiqzarab@iut-dhaka.edu',
        age: 28,
      };
    },
    post() {
      return {
        id: '1234231',
        title: 'My First Post',
        body: 'THis post resambles myself',
        published: true,
      };
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
