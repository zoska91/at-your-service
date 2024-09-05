const intentionSchema = [
  {
    name: 'describe_intention',
    description: `Describe the user intention towards assistant, based on the latest message and details from summary of their conversation.`,
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'number',
          description: `
            Type has to be set to either 1, 2 or 3:
            0: 'query' — when assistant has to say, write, translate, correct, help, simply answer to the user's question without access her long-term memory or notes. Should be picked by default and for common conversations and chit-chat.
            1: 'ask' — when the user asks assisant explicitly to perform an action that she needs to do herself related to Internet connection to the external apps, services, APIs, models (like Wolfram Alpha) finding sth on a website, calculating, giving environment related info (like weather or nearest locations) accessing and reading websites/urls contents, listing, and events and memorizing something by Alice.
            2. 'action' - when user what to save something, memorizing, add to the database, update something. Usually later on it has to use API with POST or PUT. 
          `,
        },
      },
      required: ['category', 'type'],
    },
  },
];
