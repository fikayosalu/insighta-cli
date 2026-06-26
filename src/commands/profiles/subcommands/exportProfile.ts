/**
 * This file contains a CLI command to download
 * all profiles as csv text and save in a file
 */
import { Command } from "commander";
import { loadCredentials } from "../../../utils/credentials";
import axios from "axios";
import { API_URL } from "../../../config";
import path from "node:path";
import fs from "fs";
import { axiosErrorHandler } from "../../../utils/helpers";

export const exportProfile = new Command("export")
	.description("Downloads a text of profiles")
	.requiredOption("--format <csv>", "Download as csv")
	.option("--gender <gender>", "Filter by gender")
	.option("--country <country>", "Filter by country")
	.option("--age-group <group>", "Filter by age group")
	.option("--min-age <age>", "Minimum age")
	.option("--max-age <age>", "Maximum age")
	.option("--sort-by <field>", "Sort by field")
	.option("--order <order>", "Sort order (asc/desc)")
	.action(async (options) => {
		const tokens = loadCredentials();
		if (!tokens) return console.log("Please log in");
		const params: Record<string, string> = {};

		if (options.gender) params["gender"] = options.gender;
		if (options.format) params["format"] = options.format;
		if (options.country) params["country"] = options.country;
		if (options.ageGroup) params["age_group"] = options.ageGroup;
		if (options.minAge) params["min_age"] = options.minAge;
		if (options.maxAge) params["max_age"] = options.maxAge;
		if (options.sortBy) params["sort_by"] = options.sortBy;
		if (options.order) params["order"] = options.order;

		try {
			const response = await axios.get(`${API_URL}/api/profiles/export`, {
				params,
				headers: {
					Authorization: `Bearer ${tokens.access_token}`,
					"X-API-Version": 1,
				},
				responseType: "text",
			});

			const profiles: string = response.data;
			const DIR = process.cwd();
			const FILE = path.join(DIR, `profiles_${Date.now()}.csv`);

			fs.writeFileSync(FILE, profiles, "utf-8");

			console.log(`Exported to ${FILE}`);
		} catch (error) {
			axiosErrorHandler(error);
		}
	});
