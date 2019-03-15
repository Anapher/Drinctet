import { routerActions } from "react-router-redux";
import * as gameActions from "../features/game/actions";
import * as settingsActions from "../features/settings/actions";

export default {
    game: gameActions,
    router: routerActions,
    settings: settingsActions,
}