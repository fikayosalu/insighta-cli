import fs from "fs";
import path from "path";
import os from "os";

const DIR = path.join(os.homedir(), ".insighta");
const FILE = path.join(DIR, "credentials.json");

export const saveCredentials = (
	access_token: string,
	refresh_token: string,
) => {
	// Store user auth tokens in a json file
	const content = JSON.stringify({ access_token, refresh_token }, null, 2);
	try {
		// Create directory if it doesn't exist
		fs.mkdirSync(DIR, { recursive: true });

		// Write the tokens to the file
		fs.writeFileSync(FILE, content, "utf-8");

		// Return true when the execution is complete
		return true;
	} catch (error) {
		// If there is an error return false
		return null;
	}
};

export const loadCredentials = () => {
	/**
	 * Load user auth tokens from Json file and
	 * return the tokens when successful else return
	 * null
	 */

	try {
		// Check if the Json file exists
		if (fs.existsSync(FILE)) {
			// If the file exists, read and store the contents
			const content = fs.readFileSync(FILE, "utf-8");

			// Return the contents (auth tokens)
			return JSON.parse(content);
		}

		// If the file does not exist return null
		return null;
	} catch (error) {
		// Return null if an error occurs
		return null;
	}
};

export const clearCredentials = () => {
	/**
	 * Delete the json file containing
	 * user's credentials
	 */
	try {
		// Check if Json file exists
		if (!fs.existsSync(FILE)) {
			// Return null if file does not exist
			return null;
		}

		// Delete the Json File
		fs.unlinkSync(FILE);

		// Return true on successful execution
		return true;
	} catch (error) {
		// Return null if any error
		return null;
	}
};
