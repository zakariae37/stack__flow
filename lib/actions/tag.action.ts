"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  getTopInteractedTagsParams,
} from "./shared";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params: getTopInteractedTagsParams) {
  try {
    connectToDB();
    const { userId } = params;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return [
      { _id: "1", name: "Next js" },
      { _id: "2", name: "React js" },
    ];
  } catch (error) {
    console.log(error);
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDB();
    const { searchQuery, page = 1 , pageSize = 2 } = params;
    const skipAmount = ( page - 1 ) * pageSize
    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, 'i')}}
      ]
    }
    const tags = await Tag.find(query)
    .skip(skipAmount)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    ;

    const totalTags = await Tag.countDocuments(query)
    const isNext = totalTags > skipAmount + tags.length
    return { tags, isNext };
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDB();
    const { tagId, page = 1, pageSize = 4 ,  searchQuery } = params;
    const skipAmount = ( page - 1 ) * pageSize
    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        skip: skipAmount,
        limit: pageSize + 1,
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag },
        { path: "author", model: User },
      ],
    });
    const isNext = tag.questions.length > pageSize
    if (!tag) {
      throw new Error("Tag not found");
    }
    const questions = tag.questions;
    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
  }
}

export async function getTopPopularTags() {
  try {
    connectToDB();
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.log(error);
  }
}
