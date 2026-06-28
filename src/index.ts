#!/usr/bin/env node

/**
 * This is the entry point for the CLI
 * add commands are initialized and parsed here
 */

import { Command } from "commander";
import { whoami } from "./commands/auth";
import login from "./commands/login";
import { profile } from "./commands/profiles";
import { logout } from "./commands/logout";

const program = new Command();

program.name("insighta").description("CLI for Insighta Lab+").version("1.0.0");

program.addCommand(whoami);
program.addCommand(login);
program.addCommand(logout);
program.addCommand(profile);

program.parse();
