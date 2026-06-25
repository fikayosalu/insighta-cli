import { Command } from "commander";
import { get } from "./subcommands/getAProfile";
import { list } from "./subcommands/listProfiles";
import { create } from "./subcommands/createProfile";
import { search } from "./subcommands/searchProfile";

export const profile = new Command("profile");

profile.addCommand(list);
profile.addCommand(get);
profile.addCommand(create);
profile.addCommand(search);
