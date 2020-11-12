const Query = {
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
};

export { Query as default };
