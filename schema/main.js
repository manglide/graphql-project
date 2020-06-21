const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} = require('graphql');

const roll = () => Math.floor(6 * Math.random()) + 1;

const fs = require('fs');

const readLastLinePromise = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) throw reject(err);
      resolve(data.toString().trim().split('\n').slice(-1)[0]);
    })
  })
}

const appendLinePromise = (path, line) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, line + '\n', err => {
      if (err) throw reject(err);
      resolve(line);
    });
  });
};

const queryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    hello: {
      description: 'Just saying Hello to the world at large',
      type: GraphQLString,
      resolve: () => 'world'
    },
    diceRoll: {
      description: '*** Simulate *** a dice roll determined by count',
      type: new GraphQLList(GraphQLInt),
      args: {
        count: {
          type: GraphQLInt
        }
      },
      resolve: (_, args) => {
        let rolls = [];
        for (let i = 0; i < args.count; i++) {
          rolls.push(roll());
        }
        return rolls;
      }
    },
    usersCount: {
      description: 'Total number of users in the collection',
      type: GraphQLInt,
      resolve: (_, args, { db }) =>
          db.collection('users').countDocuments()
    },
    lastQuote: {
      type: GraphQLString,
      resolve: () => readLastLinePromise('data/quotes.txt')
    }
  }
});

const mutationType = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    addQuote: {
      type: GraphQLString,
      args: {
        body: {
          type: GraphQLString
        }
      },
      resolve: (_, args) =>
        appendLinePromise('data/quotes.txt', args.body)
    }
  }
})

const mySchema = new GraphQLSchema({
  // root query & root mutation definitions
  query: queryType,
  mutation: mutationType
});

module.exports = mySchema;
