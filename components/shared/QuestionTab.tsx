import { getUserStats } from "@/lib/actions/user.action";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import { SearchParamsProps } from "@/types";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}
const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserStats({ userId, page: 1 });
  return (
    <div>
      {result?.questions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          title={question.title}
          clerkId={clerkId}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
    </div>
  );
};

export default QuestionTab;
