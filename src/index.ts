#!/usr/bin/env node

import { Command } from "commander";
import { whoami } from "./commands/auth";

const program = new Command();

program.name("insighta").description("CLI for Insighta Lab+").version("1.0.0");

program.addCommand(whoami);

program.parse();
