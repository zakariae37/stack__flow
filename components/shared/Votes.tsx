"use client";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { downvoteQuestion, upvoteQuestion } from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatNumberWithExtension } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
  type: string;
  userId: string;
  itemId: string;
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}
const Votes = ({
  type,
  userId,
  itemId,
  upvotes,
  downvotes,
  hasupVoted,
  hasdownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter()

  const handleSave =async () => {
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname
    })
  };

  const handleVote = async (action: string) => {
    if (!userId) {
      return;
    }
    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted,
          hasupVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          userId: JSON.parse(userId),
          answerId: JSON.parse(itemId),
          hasupVoted,
          hasdownVoted,
          path: pathname
        })
      }
    }
    if (action === 'downvote') {
      if (type === 'Question') {
        await downvoteQuestion ({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted,
          hasupVoted,
          path: pathname,
        })
      } else if (type === 'Answer') {
        await downvoteAnswer({
          userId: JSON.parse(userId),
          answerId: JSON.parse(itemId),
          hasupVoted,
          hasdownVoted,
          path: pathname
        })
      }
    }
  };

  useEffect(() => {
    viewQuestion({
      userId: userId ? JSON.parse(userId) : undefined,
      questionId: JSON.parse(itemId),
    })
  }, [userId, itemId, pathname, router])
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            width={18}
            height={18}
            onClick={() => handleVote("upvote")}
            className="cursor-pointer"
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumberWithExtension(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            width={18}
            height={18}
            onClick={() => handleVote("downvote")}
            className="cursor-pointer"
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumberWithExtension(downvotes)}
            </p>
          </div>
        </div>
      </div>
      <Image
        src={
          hasSaved
            ? "/assets/icons/star-filled.svg"
            : "/assets/icons/star-red.svg"
        }
        alt="star"
        width={18}
        height={18}
        className="cursor-pointer"
        onClick={handleSave}
      />
    </div>
  );
};

export default Votes;
