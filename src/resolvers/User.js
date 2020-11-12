const User = {
  //to find all the posts of the user
  posts(parent, args, { db }, info) {
    return db.posts.filter((post) => parent.id === post.author);
  },
  //to find all the comments of the user
  comments(parent, args, { db }, info) {
    return db.comments.filter((comment) => comment.author === parent.id);
  },
};

export { User as default };
