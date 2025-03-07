import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: string;
}

const AllAnswers = async ({ questionId, userId, totalAnswers }: Props) => {
  const result = await getAnswers({ questionId });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {result?.answers.map((answer) => (
          <article key={answer._id}>
            <div className="light-border border-b py-10">
              <div className="flex items-center justify-between">
                <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                  <Link
                    href={`/profile/${answer.author.clerkId}`}
                    className="flex flex-1 items-start gap-1 sm:items-center"
                  >
                    <Image
                      src={answer.author.picture}
                      width={18}
                      height={18}
                      alt="profile"
                      className="rounded-full object-cover max-sm:mt-0.5"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <p className="body-semibold text-dark300_light700">
                        {answer.author.name}
                      </p>
                      <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
                        <span className="max-sm:hidden">-</span> answered{" "}
                        {getTimestamp(answer.createdAt)}
                      </p>
                    </div>
                  </Link>
                  <div className="flex justify-end">
                    <Votes
                      type="Answer" // where we vote , in the question or in the answer
                      userId={JSON.stringify(userId)} // the user who vote
                      itemId={JSON.stringify(answer._id)} // the item who voted , (item = question or answer)
                      upvotes={answer.upvotes.length}
                      downvotes={answer.downvotes.length}
                      hasupVoted={answer.upvotes.includes(userId)} // check if the user is already vote
                      hasdownVoted={answer.downvotes.includes(userId)}
                    />
                  </div>
                </div>
              </div>
              <ParseHTML data={answer.content} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
