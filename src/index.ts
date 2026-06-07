#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program.name("insighta").description("CLI for Insighta Lab+").version("1.0.0");

program.parse();
