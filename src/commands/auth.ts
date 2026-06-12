import { Command } from "commander";
import axios from "axios";
import { loadCredentials } from "../utils/credentials";
import { API_URL } from "../config";

interface Tokens {
	access_token: string;
	refresh_token: string;
}

interface User {
	id: string;
	username: string;
	email: string;
	role: string;
	avatar_url: string;
	is_active: boolean;
	last_login_at: string;
	created_at: string;
}

export const whoami = new Command("whoami")
	.description("Show current logged-in user")
	.action(async () => {
		try {
			const tokens: Tokens = loadCredentials();

			if (!tokens) {
				console.log("Not logged in. Run 'insighta login'");
				return;
			} else {
				const response = await axios.get(`${API_URL}/auth/me`, {
					timeout: 5000,
					timeoutErrorMessage: "Request timed out",
					headers: { Authorization: `Bearer ${tokens.access_token}` },
				});

				const user: User = response.data.data;

				console.log(`Logged in as ${user.role} @ username: ${user.username}`);
			}
		} catch (error) {
			console.log("Error Please login");
		}
	});
