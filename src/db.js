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
    author: '2',
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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
