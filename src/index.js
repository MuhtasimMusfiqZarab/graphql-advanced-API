import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

//demo user data
const users = [
  {
    id: '1',
    name: 'Zarab',
    email: 'musfiqzarab@iut-dhaka.edu',
    age: 27,
  },
  {
    id: '2',
    name: 'Mou',
    email: 'mou@mag.edu',
  },
  {
    id: '3',
    name: 'Pavel',
    email: 'pavel@buet.edu',
    age: 26,
  },
];

//demo user's post
const posts = [
  {
    id: '234',
    title: 'A Long hectic day!',
    body:
      'Today was a very hectic day for me. Its all stated with some people who wanted to create some chaos in own very own life',
    published: true,
    author: '1',
  },
  {
    id: '767',
    title: 'A Quarrel',
    body: "Life won't run by the rules your make for your life",
    published: true,
    author: '2',
  },
  {
    id: '443',
    title: 'People are bad!',
    body:
      'The people around you will always like to have the things you own.It creates problem in their life as well as yours. Thus it is better that you deduct them from your life',
    published: true,
    author: '1',
  },
];

const comments = [
  {
    id: '4523',
    text: 'what are you talking about!',
    author: '2',
    post: '234',
  },
  {
    id: '078',
    text: 'All People are like that bro!',
    author: '3',
    post: '234',
  },
  {
    id: '4523',
    text: 'Sorry for everything today',
    author: '2',
    post: '767',
  },
  {
    id: '45423',
    text: 'You are hungry. RIght? ;)',
    author: '1',
    post: '443',
  },
];

//Scalar Type-String,Boolean,Int,Float,ID
//Type definitions(also known as schema) -operations that can be performed on the api & the custom data types
const typeDefs = `
type Query {
  users(query:String):[User!]!
  posts(query:String):[Post!]!
  comments(query:String):[Comment!]!
  me: User!
  post:Post!
}

type Mutation{
  createUser(name: String!, email: String!, age: Int): User!
  createPost(title:String!, body:String!, published:Boolean!, author: ID!):Post!
  createComment(text:String!, author:ID!, post:ID!):Comment!
}
 
type User {
  id:ID!
  name:String!
  email:String!
  age:Int
  posts:[Post!]!
  comments:[Comment!]!
}

type Post {
  id: ID!
  title:String!
  body:String!
  published:Boolean!
  author: User!
  comments:[Comment!]!
}

type Comment {
  id:ID!
  text:String!
  author:User!
  post:Post!
}
`;

//Resolvers
const resolvers = {
  Query: {
    //here are all of the methods for all the queries

    users(parent, args, ctx, info) {
      //if query for the user if provided then run complex logic to find the user, else return all users
      if (!args.query) {
        return users;
      }
      return users.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      //return all the posts if there is not any certain post to find
      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },

    comments(parent, args, ctx, info) {
      return comments;
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
        id: '0954',
        title: 'Who who?',
        body: 'What can we expect!',
        published: true,
      };
    },
  },

  //here is the mutaion resolver
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.email);
      if (emailTaken) {
        throw new Error('Email is taken already');
      }

      //create a new user if no email is found
      const user = {
        id: uuidv4(),
        ...args,
      };

      users.push(user);

      return user;
    },

    createPost(parent, args, ctx, info) {
      //find author id if it exists
      const userExists = users.some((user) => user.id === args.author);

      if (!userExists) {
        throw new Error('User not found!');
      }

      const post = {
        id: uuidv4(),
        ...args,
      };

      posts.push(post);
      return post;
    },

    createComment(parent, args, ctx, info) {
      //if user id exists
      const userExists = users.some((user) => user.id === args.author);
      //find the post and see if the post is published
      const postExists = posts.some(
        (post) => post.id === args.post && post.published
      );

      if (!userExists) {
        throw new Error('unable to find user');
      }
      if (!postExists) {
        throw new Error('unable to find post');
      }

      //create new comment
      const comment = {
        id: uuidv4(),
        ...args,
      };

      comments.push(comment);

      return comment;
    },
  },

  //we need a root property on  the resover as to find the author of the post we are referencing a different custom type (ex : author:User!). TThus we need a property that matches of our custom type Post
  Post: {
    //to find the author this resolver will run for every single post and the parent will contain every single post
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    //find all the comments for the post
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },

  User: {
    //to find all the posts of the user
    posts(parent, args, ctx, info) {
      return posts.filter((post) => parent.id === post.author);
    },
    //to find all the comments of the user
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id);
    },
  },
  //find the user of the comment
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    post(parent, argx, ctx, info) {
      return posts.find((post) => post.id === parent.post);
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
