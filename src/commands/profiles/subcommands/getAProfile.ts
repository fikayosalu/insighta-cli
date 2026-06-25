import { Command } from "commander";
import axios from "axios";
import { loadCredentials } from "../../../utils/credentials";
import { API_URL } from "../../../config";
import { Profile } from "../../../types";
import Table from "cli-table3";
import { axiosErrorHandler } from "../../../utils/helpers";

export const get = new Command("get")
	.description("Get a Profile by ID")
	.argument("<id>", "Profile ID")
	.action(async (id) => {
		const tokens = loadCredentials();
		if (!tokens) {
			return console.log("Please log in");
		}
		try {
			const response = await axios.get(`${API_URL}/api/profiles/${id}`, {
				headers: {
					Authorization: `Bearer ${tokens.access_token}`,
					"X-API-Version": 1,
				},
				timeout: 5000,
				timeoutErrorMessage: "Request timed out",
			});
			const profile: Profile = response.data.data;
			const table = new Table({ head: Object.keys(profile) });
			table.push(Object.values(profile));

			console.log(table.toString());
		} catch (error) {
			axiosErrorHandler(error);
		}
	});
