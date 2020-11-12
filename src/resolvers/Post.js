//we need a root property on  the resover as to find the author of the post we are referencing a different custom type (ex : author:User!). TThus we need a property that matches of our custom type Post
const Post = {
  //to find the author this resolver will run for every single post and the parent will contain every single post
  author(parent, args, { db }, info) {
    return db.users.find((user) => user.id === parent.author);
  },
  //find all the comments for the post
  comments(parent, args, { db }, info) {
    return db.comments.filter((comment) => comment.post === parent.id);
  },
};

export { Post as default };
