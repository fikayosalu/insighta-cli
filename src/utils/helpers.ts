/**
 * This module contains helper functions used to carry out
 * operations in the project in other to avoid repetition
 */

import axios from "axios";

export const axiosErrorHandler = (err: unknown): void => {
	// To handle https request errors gracefully
	if (axios.isAxiosError(err) && err.response) {
		if (err.response.status === 404) {
			// If there was a not found error
			console.log("Profile not found");
		} else if (err.response.status === 401) {
			// If it returns an authentication error
			console.log("Session expired. Please Log in.");
		} else {
			console.log(err.response.data.message || "Something went wrong");
		}
	} else {
		console.log("Something went wrong");
	}
};
