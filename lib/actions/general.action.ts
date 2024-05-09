"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongoose";
import { GlobalSearchParams } from "./shared";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

const searchableTypes = ["question", "user", "tag", "answer"];
export async function globalSearch(params: GlobalSearchParams) {
  try {
    connectToDB();
    const { query, type } = params;
    const regexQuery = { $regex:  query, $options: "i"  };
    let results = [];
    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Tag, searchField: "name", type: "tag" },
      { model: Answer, searchField: "content", type: "answer" },
    ];
    const typeLower = type?.toLowerCase();
    if (!typeLower || !searchableTypes.includes(typeLower)) {
        for( const { model, searchField, type } of modelsAndTypes){
            const queryResults = await model
                .find({ [ searchField ] : regexQuery })
                .limit(2)

                results.push(
                    ...queryResults.map((item) => ({
                        title: type === "answer"
                        ? `Answers containing ${query}` 
                        : item[searchField],
                    type,
                    id: type === 'user'
                        ? item.clerkid
                        : type === 'answer'
                            ? item.question
                            : item._id
                    }))
                )
        }
    } else {
      const modelInfo = modelsAndTypes.find((item) => item.type === type);
      if (!modelInfo) {
        throw new Error("invalid search type");
      }
      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      results = queryResults.map((item) => ({
        title: type === "answer"
            ? `Answers containing ${query}` 
            : item[modelInfo.searchField],
        type,
        id: type === 'user'
            ? item.clerkid
            : type === 'answer'
                ? item.question
                : item._id
      }));
    }
    return JSON.stringify(results)
  } catch (error) {
    console.log(error);
  }
}
