import { v4 as uuidv4 } from 'uuid';

//here is the mutaion resolver
const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);
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

  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    //if user exits
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error('User not found!');
    }

    //check if email is provided
    if (typeof data.email === 'string') {
      //if the new email is taken already
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email is taken already!');
      }
      user.email = data.email;
    }

    //if name exits
    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    //if age exists to be updated
    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }
    return user;
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
};

export { Mutation as default };
