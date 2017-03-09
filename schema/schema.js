const graphql = require('graphql');
const json-server = require('json-server');

// Tells graphql what type of data we have in the application
// Also tells how all of the types are related
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema   // Takes in a root query and returns a graphql schema instance
} = graphql;

// Gives graphql the idea of a user
const UserType = new GraphQLObjectType({
    name: 'User',   // Name of the object
    fields: {     // tells graphql about all of our object's properties
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  // This means: You can ask me about users in the application. If you send me an 'id', I will return you an object of type UserType
  fields: {
    user: {                                     // Looking for a User
      type: UserType,                           // return type
      args: { id: { type: GraphQLString } },    // required input arguments
      resolve(parentValue, args) {              // Goes into database and find data we're looking for
        // Note: this method returns raw JSON, but graphql automatically resolves the json into types
        return _.find(users, { id: args.id });  // Walk thru users and return first instance where id == args.id
      }
    }
  }
});

new GraphQLSchema({
  query: RootQuery
})

// Export the schema so it can be used elsewhere
module.exports = new GraphQLSchema({
  query: RootQuery
});
