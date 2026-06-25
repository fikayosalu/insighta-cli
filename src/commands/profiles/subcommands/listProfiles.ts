import { Command } from "commander";
import { API_URL } from "../../../config";
import axios from "axios";
import { loadCredentials } from "../../../utils/credentials";
import Table from "cli-table3";
import { Profile } from "../../../types";
import { axiosErrorHandler } from "../../../utils/helpers";

export const list = new Command("list")
	.description("List all profiles")
	.option("--gender <gender>", "Filter by gender")
	.option("--country <country>", "Filter by country")
	.option("--age-group <group>", "Filter by age group")
	.option("--min-age <age>", "Minimum age")
	.option("--max-age <age>", "Maximum age")
	.option("--sort-by <field>", "Sort by field")
	.option("--order <order>", "Sort order (asc/desc)")
	.option("--page <number>", "Page number")
	.option("--limit <number>", "Results per page")
	.action(async (options) => {
		const tokens = loadCredentials();
		if (!tokens) return console.log("Please log in");

		const params: Record<string, string> = {};

		if (options.gender) params["gender"] = options.gender;
		if (options.country) params["country_name"] = options.country;
		if (options.ageGroup) params["age_group"] = options.ageGroup;
		if (options.minAge) params["min_age"] = options.minAge;
		if (options.maxAge) params["max_age"] = options.maxAge;
		if (options.sortBy) params["sort_by"] = options.sortBy;
		if (options.order) params["order"] = options.order;
		if (options.page) params["page"] = options.page;
		if (options.limit) params["limit"] = options.limit;

		try {
			const response = await axios.get(`${API_URL}/api/profiles`, {
				params,
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
