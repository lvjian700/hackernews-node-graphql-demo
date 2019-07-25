const { ApolloServer } = require('apollo-server-lambda');
const fs = require('fs');
const path = require('path');

// 2. build resolver for api
let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews clone.`,
    feed: () => links,
    link: (parent, id) => {
      return links.find((el) => {
        return id.id == el.id
      })
    }
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }
      links.push(link)
      return link
    },
    updateLink: (parent, args) => {
      let link = links.find((el) => el.id === args.id)
      link.url = args.url
      link.description = args.description

      return link
    },
    deleteLink: (parent, args) => {
      let link = links.find((el) => el.id === args.id)
      links = links.filter(el => el.id !== args.id)

      return link
    }
  }
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();

