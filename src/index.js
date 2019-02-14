const { GraphQLServer } = require('graphql-yoga')

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
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000/`))
