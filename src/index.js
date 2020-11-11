import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

//import the databse
import db from './db';

//Resolvers
const resolvers = {
  Query: {
    //here are all of the methods for all the queries

    users(parent, args, { db }, info) {
      //if query for the user if provided then run complex logic to find the user, else return all users
      if (!args.query) {
        return db.users;
      }
      return db.users.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    posts(parent, args, { db }, info) {
      if (!args.query) {
        return db.posts;
      }

      //return all the posts if there is not any certain post to find
      return db.posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },

    comments(parent, args, { db }, info) {
      return db.comments;
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
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some(
        (user) => user.email === args.data.email
      );
      if (emailTaken) {
        throw new Error('Email is taken already');
      }

      //create a new user if no email is found
      const user = {
        id: uuidv4(),
        ...args.data,
      };

      db.users.push(user);

      return user;
    },

    deleteUser(parent, args, { db }, info) {
      //find the index of the user
      const userIndex = db.users.findIndex((user) => user.id === args.id);

      //if not found
      if (userIndex === -1) {
        throw new Error('User not found!');
      }

      //remove the user on that index
      //returing an array of the deleted users, here there is one item deleted
      const deletedUsers = db.users.splice(userIndex, 1);

      //remove the associated posts and comments of the user
      posts = db.posts.filter((post) => {
        const match = post.author === args.id;

        //delete all the comments if it match
        if (match) {
          db.dcomments = db.comments.filter(
            (comment) => comment.post !== post.id
          );
        }

        return !match;
      });

      //remove the comments the user has created on other's post
      db.comments = db.comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },

    createPost(parent, args, { db }, info) {
      //find author id if it exists
      const userExists = db.users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User not found!');
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      db.posts.push(post);
      return post;
    },

    deletePost(parent, args, { db }, info) {
      //check if the post exists
      const postIndex = db.posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found!');
      }

      //delete a post and also all the comments for the post
      const deletedPosts = dbposts.splice(postIndex, 1);

      //delete comments
      db.comments = db.comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },

    createComment(parent, args, { db }, info) {
      //if user id exists
      const userExists = db.users.some((user) => user.id === args.data.author);
      //find the post and see if the post is published
      const postExists = db.posts.some(
        (post) => post.id === args.data.post && post.published
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
        ...args.data,
      };

      db.comments.push(comment);

      return comment;
    },

    deleteComment(parent, args, { db }, info) {
      //does that comment exits
      const commentIndex = db.comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error('Comment not found!');
      }

      //delete the comment from array
      const deleteComments = db.comments.splice(commentIndex, 1);

      return deleteComments[0];
    },
  },

  //we need a root property on  the resover as to find the author of the post we are referencing a different custom type (ex : author:User!). TThus we need a property that matches of our custom type Post
  Post: {
    //to find the author this resolver will run for every single post and the parent will contain every single post
    author(parent, args, { db }, info) {
      return db.users.find((user) => user.id === parent.author);
    },
    //find all the comments for the post
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => comment.post === parent.id);
    },
  },

  User: {
    //to find all the posts of the user
    posts(parent, args, { db }, info) {
      return db.posts.filter((post) => parent.id === post.author);
    },
    //to find all the comments of the user
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => comment.author === parent.id);
    },
  },
  //find the user of the comment
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => user.id === parent.author);
    },
    post(parent, argx, { db }, info) {
      return db.posts.find((post) => post.id === parent.post);
    },
  },
};

//create new instance for graphql server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    //define the things we want to set up on context
    db,
  },
});

//start the server on localhost 4000
server.start(() => console.log('The server is running!'));
