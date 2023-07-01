import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import holidaySlice from "../slice/holidaySlice";

const configureStore= () => {
    const store = createStore(
     holidaySlice,
    composeWithDevTools(applyMiddleware(thunk))
    )
return store;    
}
export default configureStore;

