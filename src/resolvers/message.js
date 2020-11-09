import uuidv4 from "uuid/v4";
export default {
  Query: {
    messages: async (parent, args, { models }) => {
      return await models.Message.findAll();
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findByPk(id);
    }
  },

  Mutation: {
    createMessage: async (parent, { text }, { me, models }) => {
      return await models.Message.create({
        text,
        userId: me.id
      });
    },
    deleteMessage: async (parent, { id }, { models }) => {
      return await models.Message.destroy({ where: { id } });
    },
    updateMessage: async (parent, { id, newText }, { models }) => {
      let message = await models.Message.findByPk(id);

      message.dataValues.text = newText;

      await models.Message.upsert(message.dataValues);

      return models.Message.findByPk(id);
    }
  },
  Message: {
    user: (message, args, { models }) => models.users[message.userId]
  }
};
