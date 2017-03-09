const express = require('express');
const expressGraphQL = require('express-graphql');  // compatibility layer
const schema = require('./schema/schema');

// Stands up an express server
const app = express();

// When incoming URl includes /graphql, use expressGraphQL
app.use('/graphql', expressGraphQL({
  schema,             // i.e. schema: schema
  graphiql: true      // can make queries against dev server
}));

app.listen(4000, () => {
  console.log('Listening');
});
