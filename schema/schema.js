const graphql = require('graphql');
const axios = require('axios');      // used for making http requests

// Tells graphql what type of data we have in the application
// Also tells how all of the types are related
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,   // Takes in a root query and returns a graphql schema instance
  GraphQLList,
  GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({  // This needs to be wrapped in a closure so it gets access to vars (otherwise this query could not reference UserType bc it's defined below)
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(resp => resp.data);
      }
    }
  })
})

// Gives graphql the idea of a User
const UserType = new GraphQLObjectType({
  name: 'User',   // Name of the object
  fields: () => ({       // tells graphql about all of our object's properties
    id: { type: GraphQLString },      // every User will have an id of type String
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(resp => resp.data);
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  // This means: You can ask me about users in the application. If you send me an 'id', I will return you an object of type UserType
  fields: {
    user: {                                     // Looking for a User
      type: UserType,                           // return type
      args: { id: { type: GraphQLString } },    // required input arguments
      resolve(parentValue, args) {              // Goes into database and find data we're looking for (If we return a Promise in the next line, GraphQL will wait for asnyc request to be resolved and then send it back)
        // Note: this method returns raw JSON, but graphql automatically resolves the json into types
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data);     // graphql response wrapped in data key
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {    // Name of Mutation
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) }, // Non optional arg
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }    // Optional arg
      },
      resolve(parentValue, { firstName, age, companyId }) {  // deconstructing 'args' (args.firstName, args.age)
        return axios.post('http://localhost:3000/users', { firstName, age })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args}`, args)
          .then(res => res.data);
      }
    }
  }
})

// Export the schema so it can be used elsewhere
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation    // same as mutation: mutation
});
