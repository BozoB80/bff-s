import type { Tables } from "./database.types";

type TPostWithUserAndComments = Tables<"posts"> & {
	users: Tables<"users"> | null;
	comments?: TCommentWithUser[];
};

type TCommentWithUser = Tables<"comments"> & {
	users: Tables<"users"> | null;
	replies?: TCommentWithUser[];
};

export type { TCommentWithUser, TPostWithUserAndComments };
