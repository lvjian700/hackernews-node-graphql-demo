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
  MediaResult: {
    __resolveType(obj, context, info) {
      if (obj.url) {
        return 'Link';
      }

      if (obj.text) {
        return 'Text';
      }
    }
  },
  Query: {
    info: () => `This is the API of a Hackernews clone.`,
    feed: () => links,
    link: (parent, params, context, info) => {
      console.log('context: ', context);
      return links.find((el) => {
        return params.id == el.id
      })
    },
    medias: () => {
      return [{
        id: 'link-0',
        description: 'this is a link',
        url: 'www.link1.com'
      }, {
        id: 'text-0',
        text: 'i am a text'
      }];
    },
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
    updateLink: (parent, {input}, context) => {
      console.log(input);
      console.log(context);
      let link = links.find((el) => el.id === input.id)
      link.url = input.url
      link.description = input.description

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
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
});

exports.handler = server.createHandler();

