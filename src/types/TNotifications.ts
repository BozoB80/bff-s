import type { Tables } from "./database.types";

type TNotificationWithUsers = Tables<"notifications"> & {
	users: Tables<"users"> | null;
};

export type { TNotificationWithUsers };
