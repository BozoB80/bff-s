import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

export const uploadImage = async (
	localUri: string,
	supabase: SupabaseClient<Database>,
) => {
	const fileRes = await fetch(localUri);
	const arrayBuffer = await fileRes.arrayBuffer();

	const fileExt = localUri.split(".").pop()?.toLowerCase() ?? "jpeg";
	const path = `${Date.now()}.${fileExt}`;

	const { error, data } = await supabase.storage
		.from("images")
		.upload(path, arrayBuffer);

	if (error) {
		throw error;
	} else {
		return data.path;
	}
};

export const downloadImage = async (
	image: string,
	supabase: SupabaseClient<Database>,
) => {
	return new Promise((resolve, reject) => {
		supabase.storage
			.from("images")
			.download(image)
			.then(({ error, data }) => {
				if (error) {
					reject(error);
				} else {
					const fr = new FileReader();
					fr.readAsDataURL(data);
					fr.onload = () => {
						resolve(fr.result as string);
					};
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
};
