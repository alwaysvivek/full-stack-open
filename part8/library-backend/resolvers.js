const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const { GraphQLError } = require("graphql");
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Volume = require("./models/volume");
const Writer = require("./models/writer");
const User = require("./models/user");

const resolvers = {
  Query: {
    volumeCount: async () => Volume.collection.countDocuments(),
    writerCount: async () => Writer.collection.countDocuments(),
    allVolumes: async (root, args) => {
      const writer = await Writer.findOne({ name: args.writer });
      if (args.writer && args.genre) {
        return Volume.find({ $and: [{ writer: writer.id }, { genres: { $in: [args.genre] } }] }).populate("writer");
      } else if (args.writer) {
        return Volume.find({ writer: writer.id }).populate("writer");
      } else if (args.genre) {
        return Volume.find({ genres: { $in: [args.genre] } }).populate("writer");
      }
      return Volume.find({}).populate("writer");
    },
    allWriters: async () => Writer.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Writer: {
    name: (root) => root.name,
    born: (root) => root.born,
    volumeCount: (root) => root.volumeCount,
    id: (root) => root._id
  },
  Volume: {
    title: (root) => root.title,
    published: (root) => root.published,
    genres: (root) => root.genres,
    writer: async (root) => await Writer.findById(root.writer),
    id: (root) => root._id
  },
  Mutation: {
    addVolume: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      try {
        let writer = await Writer.findOne({ name: args.writer });
        if (!writer) {
          writer = new Writer({ name: args.writer });
        }
        writer.volumeCount += 1;
        const volume = new Volume({ ...args, writer: writer._id });
        await volume.save();
        await writer.save();
        pubsub.publish("VOLUME_ADDED", { volumeAdded: volume });
        return volume;
      } catch (error) {
        let errorMessage = "Saving volume failed";

        if (error instanceof mongoose.Error.ValidationError) {
          console.log(error.message);

          if (error.errors.hasOwnProperty("name")) {
            errorMessage = "Saving volume failed. Writer name is not valid";
          } else if (error.errors.hasOwnProperty("title")) {
            errorMessage = "Saving volume failed. Volume title is not valid";
          }
          throw new GraphQLError(errorMessage, {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        } else {
          console.log(error);
          throw new GraphQLError(errorMessage);
        }
      }
    },
    editWriter: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const writer = await Writer.findOne({ name: args.name });

      if (writer) {
        writer.born = args.setBornTo;

        try {
          return await writer.save();
        } catch (error) {
          console.log(error);
          throw new GraphQLError("Editing writer failed");
        }
      }

      return null;
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });

      try {
        return await user.save();
      } catch (error) {
        let errorMessage = "Creating user failed";

        if (error instanceof mongoose.Error.ValidationError) {
          console.log(error.message);

          if (error.errors.hasOwnProperty("usename")) {
            errorMessage = "Creating user failed. User name is not valid";
          } else if (error.errors.hasOwnProperty("favoriteGenre")) {
            errorMessage =
              "Creating user failed. User favorite genre is not valid";
          }
          throw new GraphQLError(errorMessage, {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        } else {
          console.log(error);
          throw new GraphQLError(errorMessage);
        }
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    volumeAdded: {
      subscribe: () => pubsub.asyncIterableIterator('VOLUME_ADDED')
    },
  },
};

module.exports = resolvers;
