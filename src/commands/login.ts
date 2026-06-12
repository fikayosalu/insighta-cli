import { Command } from "commander";
import crypto from "crypto";
import http from "http";
import axios from "axios";
import { API_URL, GITHUB_CLI_ID } from "../config";
import { saveCredentials } from "../utils/credentials";
import open from "open";

const login = new Command("login")
	.description("Logs in user to the CLI")
	.action(async () => {
		const state = crypto.randomBytes(16).toString("hex");
		const codeVerifier = crypto.randomBytes(32).toString("hex");

		const code_challenge = crypto
			.createHash("sha256")
			.update(codeVerifier)
			.digest("base64url");

		try {
			const server = http.createServer(async (req, res) => {
				const urlObj = new URL(req.url!, "http://localhost:9876");
				const urlPath = urlObj.pathname;

				if (urlPath === "/callback") {
					const code = urlObj.searchParams.get("code");
					const returnState = urlObj.searchParams.get("state");
					if (returnState === state) {
						const response = await axios.post(
							`${API_URL}/auth/github/cli`,
							{
								code,
								code_verifier: codeVerifier,
							},
							{ timeout: 5000, timeoutErrorMessage: "Request time out" },
						);
						const { access_token, refresh_token } = response.data.data;
						saveCredentials(access_token, refresh_token);

						res.writeHead(200, { "Content-Type": "text/html" });
						res.end(`Login Successful. You can close this tab`);
						console.log("Login Successful");
					} else {
						res.writeHead(400, { "Content-Type": "text/html" });
						res.end(`Login Failed. Please try again`);
						console.log("Error: state does not match. Please try again");
					}
					server.close();
				}
			});

			server.listen(9876, "localhost", async () => {
				await open(
					`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLI_ID}&redirect_uri=http://localhost:9876/callback&scope=user:email&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256`,
				);
			});
		} catch (error) {
			console.log("Login Failed. Please try again later.");
		}
	});

export default login;
