import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { userModal } from "./userModal";
import { albumLikeModal } from "./albumLikeModal";

const ALBUM_WORKOUT_COLLECTION_NAME = "album-workout";
const ALBUM_WORKOUT_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(1).max(50).trim().strict(),
  imgURL: Joi.string().required().min(1).trim().strict(),
  description: Joi.string().required().min(1).trim().strict(),
  status: Joi.string().valid("Public", "Private"),
  imgPublicId: Joi.string().required().min(1),
  details: Joi.object(),
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  // likeNumber: Joi.number().default(0),
  // likedUserIds: Joi.array()
  //   .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
  //   .default([]),
  // exercisesIds: Joi.array()
  //   .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
  //   .default([]),
});

const createNew = async (reqBody, userId) => {
  const data = reqBody;
  data.userId = userId;
  try {
    const checkedData = await ALBUM_WORKOUT_COLLECTION_SCHEMA.validateAsync(
      data
    );
    checkedData.userId = new ObjectId(checkedData.userId);
    const result = await GET_DB()
      .collection(ALBUM_WORKOUT_COLLECTION_NAME)
      .insertOne(checkedData);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// const findOneById = async (id) => {
//   try {
//     const result = await GET_DB()
//       .collection(ALBUM_WORKOUT_COLLECTION_NAME)
//       .aggregate([
//         {
//           $match: { _id: new ObjectId(id) },
//         },
//         {
//           $lookup: {
//             from: userModal.USER_COLLECTION_NAME,
//             let: { userId: "$userId" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$_id", "$$userId"] },
//                 },
//               },
//               {
//                 $project: {
//                   _id: 1,
//                   userName: 1,
//                   avatarImg: 1,
//                 },
//               },
//             ],
//             as: "user",
//           },
//         },
//         { $unwind: "$user" },
//       ])
//       .toArray();
//     return result[0];
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const getAll = async () => {
//   try {
//     const result = await GET_DB()
//       .collection(ALBUM_WORKOUT_COLLECTION_NAME)
//       .aggregate([
//         {
//           $lookup: {
//             from: userModal.USER_COLLECTION_NAME,
//             let: { userId: "$userId" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: { $eq: ["$_id", "$$userId"] },
//                 },
//               },
//               {
//                 $project: {
//                   _id: 1,
//                   userName: 1,
//                   avatarImg: 1,
//                 },
//               },
//             ],
//             as: "user",
//           },
//         },
//         { $unwind: "$user" },
//       ])
//       .toArray();

//     return result;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(ALBUM_WORKOUT_COLLECTION_NAME)
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
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

const getAllPublic = async () => {
  try {
    const result = await GET_DB()
      .collection(ALBUM_WORKOUT_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            status: "Public",
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
            // likedUsers: [
            //   {
            //     _id: "$likedUsers._id",
            //     userName: "$likedUsers.userName",
            //     avatarImg: "$likedUsers.avatarImg",
            //   },
            // ],
            likedUsers: 1,
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

const updateAlbum = async (id, reqBody) => {
  if (reqBody.oldImgPublicId) {
    delete reqBody.oldImgPublicId;
  }
  reqBody.updatedAt = Date.now();
  try {
    const result = await GET_DB()
      .collection(ALBUM_WORKOUT_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: reqBody },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteAlbum = async (id) => {
  try {
    const result = await GET_DB()
      .collection(ALBUM_WORKOUT_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(id) });
    await GET_DB()
      .collection(albumLikeModal.ALBUM_LIKE_COLLECTION_NAME)
      .deleteMany({ albumWorkoutId: new ObjectId(id) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateDetails = async (id, details) => {
  try {
    const result = await GET_DB()
      .collection(ALBUM_WORKOUT_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { details: details } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const albumnWorkoutModal = {
  ALBUM_WORKOUT_COLLECTION_NAME,
  createNew,
  findOneById,
  getAllPublic,
  updateAlbum,
  deleteAlbum,
  updateDetails,
};
