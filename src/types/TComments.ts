import type { Tables } from "./database.types";

type TPostWithUserAndComments = Tables<"posts"> & {
	users: Tables<"users"> | null;
	comments: TCommentWithUser[];
};

type TCommentWithUser = Tables<"comments"> & {
	users: Tables<"users"> | null;
};

export type { TCommentWithUser, TPostWithUserAndComments };
