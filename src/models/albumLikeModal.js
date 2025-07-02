import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { albumnWorkoutModal } from "./albumWorkoutModal";
import { userModal } from "./userModal";

const ALBUM_LIKE_COLLECTION_NAME = "album-like";
const ALBUM_LIKE_COLLECTION_SCHEMA = Joi.object({
  albumWorkoutId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
});

const likeAlbum = async (albumWorkoutId, userId, isLike) => {
  try {
    if (isLike) {
      const checkedData = await ALBUM_LIKE_COLLECTION_SCHEMA.validateAsync({
        albumWorkoutId,
        userId,
      });
      checkedData.albumWorkoutId = new ObjectId(checkedData.albumWorkoutId);
      checkedData.userId = new ObjectId(checkedData.userId);
      const result = await GET_DB()
        .collection(ALBUM_LIKE_COLLECTION_NAME)
        .insertOne(checkedData);
      return result;
    } else {
      const result = await GET_DB()
        .collection(ALBUM_LIKE_COLLECTION_NAME)
        .findOneAndDelete({
          albumWorkoutId: new ObjectId(albumWorkoutId),
          userId: new ObjectId(userId),
        });
      return result;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const findAlbumById = async (albumWorkoutId) => {
  try {
    const result = await GET_DB()
      .collection(albumnWorkoutModal.ALBUM_WORKOUT_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(albumWorkoutId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAlbumById = async (albumWorkoutId) => {
  try {
    const result = await GET_DB()
      .collection(albumnWorkoutModal.ALBUM_WORKOUT_COLLECTION_NAME)
      .aggregate([
        { $match: { _id: new ObjectId(albumWorkoutId) } },
        {
          $lookup: {
            from: ALBUM_LIKE_COLLECTION_NAME,
            localField: "_id",
            foreignField: "albumWorkoutId",
            as: "likes",
          },
        },

        {
          $addFields: {
            likeNumber: { $size: "$likes" },
          },
        },

        {
          $lookup: {
            from: userModal.USER_COLLECTION_NAME,
            localField: "userId",
            foreignField: "_id",
            as: "users",
          },
        },

        {
          $unwind: "$users",
        },

        {
          $lookup: {
            from: userModal.USER_COLLECTION_NAME,
            let: { likeUserIds: "$likes.userId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$likeUserIds"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  userName: 1,
                  avatarImg: 1,
                },
              },
            ],
            as: "likedUsers",
          },
        },

        {
          $project: {
            _id: 1,
            title: 1,
            imgURL: 1,
            description: 1,
            status: 1,
            imgPublicId: 1,
            details: 1,
            userId: 1,
            createdAt: 1,
            userName: "$users.userName",
            avatarImg: "$users.avatarImg",
            likeNumber: "$likeNumber",
            likedUsers: 1,
          },
        },
      ])
      .toArray();
    return result[0];
  } catch (error) {
    throw new Error(error);
  }
};

const countLikeAlbum = async (albumWorkoutId, userId) => {
  try {
    const result = await GET_DB()
      .collection(ALBUM_LIKE_COLLECTION_NAME)
      .count({
        albumWorkoutId: new ObjectId(albumWorkoutId),
        userId: new ObjectId(userId),
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const albumLikeModal = {
  ALBUM_LIKE_COLLECTION_NAME,
  likeAlbum,
  countLikeAlbum,
  getAlbumById,
  findAlbumById,
};
