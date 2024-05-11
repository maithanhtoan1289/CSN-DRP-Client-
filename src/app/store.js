import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/Users/usersSlice";
import goongReducer from "../features/Goong/goongSlice";
import naturalDisasterReducer from "../features/NaturalDisaster/naturalDisastersSlice";
import problemReducer from "../features/Problems/problemsSlice";
import employeeReducer from "../features/Employees/employeesSlice";
import historyNaturalDisasterReducer from "../features/Histories/historyNaturalDisastersSlice";
import historyProblemReducer from "../features/Histories/historyProblemsSlice";
import uploadsReducer from "../features/Uploads/uploadsSlice";

const rootReducer = {
  user: usersReducer,
  goong: goongReducer,
  naturalDisaster: naturalDisasterReducer,
  problem: problemReducer,
  employee: employeeReducer,
  historyNatural: historyNaturalDisasterReducer,
  historyProblem: historyProblemReducer,
  uploads: uploadsReducer,
};
//test
const store = configureStore({
  reducer: rootReducer,
});

export default store;
