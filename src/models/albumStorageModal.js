import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { albumnWorkoutModal } from "./albumWorkoutModal";
import { userModal } from "./userModal";
import { albumLikeModal } from "./albumLikeModal";

const ALBUM_STORAGE_COLLECTION_NAME = "album-storage";
const ALBUM_STORAGE_COLLECTION_SCHEMA = Joi.object({
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

const saveAlbum = async (userId, albumWorkoutId, isSave) => {
  try {
    if (isSave) {
      const checkedData = await ALBUM_STORAGE_COLLECTION_SCHEMA.validateAsync({
        albumWorkoutId,
        userId,
      });
      checkedData.albumWorkoutId = new ObjectId(checkedData.albumWorkoutId);
      checkedData.userId = new ObjectId(checkedData.userId);
      const result = await GET_DB()
        .collection(ALBUM_STORAGE_COLLECTION_NAME)
        .insertOne(checkedData);
      return result;
    } else {
      const result = await GET_DB()
        .collection(ALBUM_STORAGE_COLLECTION_NAME)
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

const getAll = async (userId) => {
  const userObjectId = new ObjectId(userId);
  try {
    const result = await GET_DB()
      .collection(albumnWorkoutModal.ALBUM_WORKOUT_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            $expr: {
              $or: [
                { $eq: ["$status", "Public"] },
                {
                  $and: [
                    { $eq: ["$status", "Private"] },
                    { $eq: ["$userId", userObjectId] },
                  ],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: ALBUM_STORAGE_COLLECTION_NAME,
            let: { albumWorkoutId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$albumWorkoutId", "$$albumWorkoutId"] },
                      { $eq: ["$userId", userObjectId] },
                    ],
                  },
                },
              },
            ],
            as: "matchedStorage",
          },
        },
        {
          $match: {
            "matchedStorage.0": { $exists: true },
          },
        },
        {
          $project: {
            matchedStorage: 0,
          },
        },

        {
          $lookup: {
            from: albumLikeModal.ALBUM_LIKE_COLLECTION_NAME,
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
          $lookup: {
            from: albumStorageModal.ALBUM_STORAGE_COLLECTION_NAME,
            localField: "_id",
            foreignField: "albumWorkoutId",
            as: "storages",
          },
        },

        {
          $lookup: {
            from: userModal.USER_COLLECTION_NAME,
            let: { storeUserIds: "$storages.userId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$storeUserIds"],
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
            as: "storedUsers",
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
            storedUsers: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const albumStorageModal = {
  saveAlbum,
  getAll,
  ALBUM_STORAGE_COLLECTION_NAME,
};
