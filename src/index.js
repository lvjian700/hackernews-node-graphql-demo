const { GraphQLServer } = require('graphql-yoga')

// 1. define GraphQL schema
const typeDefs = `
type Query {
  info: String!
}
`

// 2. build resolver for api
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews clone.`,
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000/`))
