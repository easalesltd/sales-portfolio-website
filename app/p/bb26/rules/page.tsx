import { redirect } from "next/navigation";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";

export default function RulesRedirect() {
  redirect(`${GBBO_LEAGUE_PATH}/crimewatch`);
}