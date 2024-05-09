import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getJoinedDate } from "@/lib/utils";
import PortfolioLink from "@/components/shared/PortfolioLink";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswerTab from "@/components/shared/AnswerTab";

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();
  const userInfo = await getUserInfo({ userId: params.id });
  return (
    <>
      <div>
        <div>
          <Image
            src={userInfo?.user.picture}
            alt="profile"
            width={140}
            height={140}
            className="rounded-full object-contain"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo?.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo?.user.username}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo?.user.location && (
                <PortfolioLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo.user.location}
                />
              )}
              {userInfo?.user.portfolioWebsite && (
                <PortfolioLink
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.portfolioWebsite}
                  title="Portfolio"
                />
              )}

              <PortfolioLink
                imgUrl="/assets/icons/calendar.svg"
                title={getJoinedDate(userInfo?.user.joinedAt)}
              />
            </div>
            {userInfo?.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {/* we can see a lot of prifle pages , but we want to know is this your profile because you only one who can to edit your profile */}
            {clerkId === userInfo?.user.clerkId && (
              <Link href={`/profile/edit`}>
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={userInfo?.totalQuestions || 0}
        totalAnswers={userInfo?.totalAnswers || 0}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab
              searchParams={searchParams}
              userId={userInfo?.user._id}
              clerkId={userInfo?.user.clerkId}
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswerTab 
              searchParams={searchParams}
              userId={userInfo?.user._id}
              clerkId={userInfo?.user.clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
