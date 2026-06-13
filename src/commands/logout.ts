import { Command } from "commander";
import { clearCredentials, loadCredentials } from "../utils/credentials";
import axios from "axios";
import { API_URL } from "../config";

export const logout = new Command("logout")
	.description("Logs out a user and closes session")
	.action(async () => {
		const tokens = loadCredentials();

		if (!tokens) {
			console.log("Please login");
			return;
		}
		const refreshToken = tokens.refresh_token;
		try {
			const response = await axios.post(
				`${API_URL}/auth/logout`,
				{ refresh_token: refreshToken },
				{ timeout: 5000, timeoutErrorMessage: "Request timed out" },
			);
			if (response.status === 200) {
				clearCredentials();
				console.log("Logged Out Successful");
			} else {
				throw new Error();
			}
		} catch (error) {
			console.log("Something went wrong please try again");
		}
	});
