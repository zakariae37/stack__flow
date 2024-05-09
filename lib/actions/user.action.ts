"use server";

import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import { connectToDB } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParms,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDB();
    const { searchQuery, filter, page = 1 , pageSize = 2 } = params;
    const skipAmount = ( page - 1 ) * pageSize
    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }
    const users = await User.find(query)
    .skip(skipAmount)
    .limit(pageSize)
    .sort(sortOptions);

    const totalUsers = await User.countDocuments(query)
    const isNext = totalUsers > skipAmount + users.length
    return { users, isNext };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    connectToDB();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDB();

    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDB();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDB();
    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete user from db
    // delete questins, comments , answer ...

    // get question ids

    // const userQuestionIds = await Question.find({ author: user._id}).distinct('_id')

    // delete user questions

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDB();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getSavedQuetions(params: GetSavedQuestionsParams) {
  try {
    connectToDB();
    const { clerkId, searchQuery, page = 1, pageSize = 3 } = params;
    const skipAmount = ( page - 1 ) * pageSize
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        skip: skipAmount,
        limit : pageSize + 1,
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag },
        { path: "author", model: User },
      ],
    });
    const isNext = user.saved.length > pageSize 

    if (!user) {
      throw new Error("User not found");
    }
    const savedQuestions = user.saved;
    
    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDB();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }
    // the user can be asked a question or answer to a question, so we want to see how much the questions he have and also for the answers
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserStats(params: GetUserStatsParms) {
  try {
    connectToDB();
    const { userId } = params;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const userQuestions = await Question.find({ autor: userId })
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ views: -1, upvotes: -1 });

    return { totalQuestions, questions: userQuestions };
  } catch (error) {
    console.log();
  }
}

export async function getUserAnswers(params: GetUserStatsParms) {
  try {
    connectToDB();
    const { userId } = params;
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const userAnswers = await Answer.find({ autor: userId })
      .populate({ path: "question", model: Question })
      .populate({ path: "author", model: User })
      .sort({ upvotes: -1 });

    return { totalAnswers, answers: userAnswers };
  } catch (error) {
    console.log();
  }
}
