/**
 * This module contains command that accepts Natural Language
 * as argument and sends to the server to get Profiles that match
 * the string
 */

import axios from "axios";
import { Command } from "commander";
import { loadCredentials } from "../../../utils/credentials";
import { API_URL } from "../../../config";
import { axiosErrorHandler } from "../../../utils/helpers";
import { Profile } from "../../../types";
import Table from "cli-table3";

export const search = new Command("search")
	.description(
		"Accepts a Natural Language string, and get Profiles that match the string",
	)
	.argument("<string>", "Natural Language string")
	.action(async (str) => {
		const tokens = loadCredentials();

		if (!tokens) return console.log("Please Log in");

		try {
			const response = await axios.get(`${API_URL}/api/profiles/search`, {
				params: { q: str },
				headers: {
					Authorization: `Bearer ${tokens.access_token}`,
					"X-API-Version": 1,
				},
				timeout: 5000,
				timeoutErrorMessage: "Request timed out",
			});
			const profiles: Profile[] = response.data.data;
			if (!profiles || profiles.length == 0) {
				console.log([]);
				return;
			} else {
				const table = new Table({ head: Object.keys(profiles[0]!) });
				profiles.forEach((element) => {
					table.push(Object.values(element));
				});
				console.log(table.toString());
				console.log(
					`Page ${response.data.page} of ${response.data.total_pages} | Total: ${response.data.total}`,
				);
			}
		} catch (error) {
			axiosErrorHandler(error);
		}
	});
