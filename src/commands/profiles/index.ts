import { Command } from "commander";
import { get } from "./subcommands/getAProfile";
import { list } from "./subcommands/listProfiles";

export const profile = new Command("profile");

profile.addCommand(list);
profile.addCommand(get);
