import { IUser } from "@/database/user.model";
import { Schema } from "mongoose";

export interface CreateQuestionParams {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  tags: string[];
  path: string;
}

export interface GetUserByIdParams {
  userId: string
}

export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

export interface DeleteUserParams {
  clerkId: string;
}

export interface GetQuestionsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface GetAllUsersParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}

export interface getTopInteractedTagsParams {
  limit?: number,
  userId: string
}

export interface GetAllTagsParams {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface GetQuestionByIdParams {
  questionId: string
}

export interface CreateAnsweParams {
  author: string,
  content: string,
  question : string,
  path: string
}

export interface GetAnswersParams {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface QuestionVoteParams{
  questionId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

export interface AnswerVoteParams {
  answerId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

export interface ToggleSaveQuestionParams {
  userId: string,
  questionId: string,
  path: string
}

export interface GetSavedQuestionsParams {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export interface ViewQuestionParams {
  userId: string, // we want to Know the user who view the question 
  questionId: string// we want to Know the question is viewed
}

export interface GetQuestionsByTagIdParams {
  tagId: string,
  page?: number,
  pageSize?: number,
  filter?: string,
  searchQuery?: string,
}

export interface GetUserStatsParms {
  userId: string;
  page?: number,
  pageSize?: number
}

export interface DeleteQuestionParams {
  questionId: string,
  path: string
}

export interface DeleteAnswerParams {
  answerId: string,
  path: string
}

export interface EditQuestionParams {
  questionId: string,
  title: string,
  content: string,
  path: string,
}

export interface GlobalSearchParams {
  query?: string | null,
  type?: string | null
}