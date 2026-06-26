/**
 * This file contains CLI command "create" ,
 * used to create a profile in the database
 */

import { Command } from "commander";
import { loadCredentials } from "../../../utils/credentials";
import axios from "axios";
import { API_URL } from "../../../config";
import { Profile } from "../../../types";
import Table from "cli-table3";
import { axiosErrorHandler } from "../../../utils/helpers";

export const create = new Command("create")
	.description("Create a profile")
	.requiredOption("--name <name>", "name of the profile to create")
	.action(async (options) => {
		const tokens = loadCredentials();
		if (!tokens) return console.log("Please log in");

		try {
			const response = await axios.post(
				`${API_URL}/api/profiles`,
				{
					name: options.name,
				},
				{
					headers: {
						Authorization: `Bearer ${tokens.access_token}`,
						"X-API-Version": 1,
					},
					timeout: 5000,
					timeoutErrorMessage: "Request time out",
				},
			);
			const profile: Profile = response.data.data;
			const table = new Table({ head: Object.keys(profile) });
			table.push(Object.values(profile));
			console.log(table.toString());
		} catch (error) {
			axiosErrorHandler(error);
		}
	});
