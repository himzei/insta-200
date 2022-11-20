import client from "../../client";

export default {
  Query: {
    seeHashtag: (_, { hashtag, page }) =>
      client.hashtag.findUnique({
        where: {
          hashtag,
        },
      }),
  },
};
