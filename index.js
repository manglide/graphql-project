const { graphql } = require('graphql');
const { MongoClient } = require('mongodb');
const assert = require('assert');
const readline = require('readline');

const graphqlHTTP = require('express-graphql');
const express = require('express');

const app = express();

const MONGO_URL = 'mongodb://graphql:uLmWbu2map@localhost:27017/graphql';

MongoClient.connect(MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  assert.equal(null, err);
  // console.log('Connected to MongoDB Server');
  var db = client.db('graphql');
  const mySchema = require('./schema/main');

  // const rli = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });
  //
  // rli.question('Request : ', inputQuery => {
  //   graphql(mySchema, inputQuery, {}, { db }).then(result => {
  //     console.log('Server Answer :', result.data);
  //     db.close(() => rli.close());
  //   });
  //
  // });

  app.use('/graphql', graphqlHTTP({
    schema: mySchema,
    context: { db },
    graphiql: true
  }));
  app.listen(3000, () => console.log('Running Express on Port 3000'))
});
