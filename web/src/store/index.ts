import { RootAction, RootState, Services } from "DrinctetTypes";
import { applyMiddleware, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import services from "../services";
import rootEpic from "./root-epic";
import { composeEnhancers } from "./utils";
import rootReducer from "./root-reducer";
import { loadState, persistState } from "./storage";

export const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, Services>({
    dependencies: services,
});

// configure middlewares
const middlewares = [epicMiddleware];

// compose enchancers
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// rehydrate state on app start
const initialState = loadState();

// create store
const store = createStore(rootReducer, initialState, enhancer);
persistState(store);

epicMiddleware.run(rootEpic);

// export store singleton instance
export default store;
