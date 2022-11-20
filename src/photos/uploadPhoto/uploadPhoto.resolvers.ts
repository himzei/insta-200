import { Photo } from "@prisma/client";
import client from "../../client";
import { Context } from "../../types";
import { protectedResolver } from "../../users/users.utils";

interface UploadPhotoAags {
  file: string;
  caption?: string;
}

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (
        _,
        { file, caption }: UploadPhotoAags,
        { loggedInUser }: Context
      ): Promise<Photo> => {
        let hashtagObj = [];
        if (caption) {
          // 한글 해시태그
          const hashtags =
            caption.match(/#[\d|A-Z|a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/g) || [];
          hashtagObj = hashtags.map((hashtag) => ({
            where: { hashtag },
            create: { hashtag },
          }));
        }
        return client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
      }
    ),
  },
};
