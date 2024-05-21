import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import withAuthentication from "./components/HOCs/withAuthentication";
import "./index.css";
import LayoutAdmin from "./components/layout/LayoutAdmin";
import LayoutClient from "./components/layout/LayoutClient";
import { initializeUserInfoFromToken } from "./utils/authUtils";
import { motion } from "framer-motion";

const Home = lazy(() => import("./pages/Client/Home"));
const RescueSeeker = lazy(() => import("./pages/Client/RescueSeeker"));
const RescueHistory = lazy(() => import("./pages/Client/RescueHistory"));
const News = lazy(() => import("./pages/Client/News"));
const Problem = lazy(() => import("./pages/Client/Problem"));
const Incident = lazy(() => import("./pages/Client/Incident"));
const InforUser = lazy(() => import("./pages/Client/InforUser"));
const HistoryProlem = lazy(() => import("./pages/Client/HistoryProlem"));

const Register = lazy(() => import("./pages/Client/Register"));
const NotFound = lazy(() => import("./pages/Client/NotFound"));
const Login = lazy(() => import("./pages/Client/Login"));
const AdminNaturalDisaster = lazy(() =>
    import("./components/tables/NaturalDisasterManagement")
);
const AdminProblem = lazy(() =>
    import("./components/tables/ProblemManagement")
);
const AdminUser = lazy(() => import("./components/tables/UserManagement"));
const AdminEmployee = lazy(() =>
    import("./components/tables/EmployeeManagement")
);
const AdminHistoryNatural = lazy(() =>
    import("./components/tables/HistoryNaturalManagement")
);
const AdminHistoryProblem = lazy(() =>
    import("./components/tables/HistoryProblemManagement")
);
const AdminProblemIncident = lazy(() =>
    import("./components/tables/AdminProblemIncident")
);

const AuthenticatedAdminNaturalDisaster = withAuthentication(
    AdminNaturalDisaster,
    ["ROLE_ADMIN"]
);
const AuthenticatedAdminProblem = withAuthentication(AdminProblem, [
    "ROLE_ADMIN",
]);
const AuthenticatedAdminUser = withAuthentication(AdminUser, ["ROLE_ADMIN"]);
const AuthenticatedAdminEmployee = withAuthentication(AdminEmployee, [
    "ROLE_ADMIN",
]);
const AuthenticatedAdminHistoryNatural = withAuthentication(
    AdminHistoryNatural,
    ["ROLE_ADMIN"]
);
const AuthenticatedAdminHistoryProblem = withAuthentication(
    AdminHistoryProblem,
    ["ROLE_ADMIN"]
);
const AuthenticatedAdminProblemIncident = withAuthentication(
    AdminProblemIncident,
    ["ROLE_ADMIN"]
);

function App() {
    initializeUserInfoFromToken();

    return (
        <Suspense
            fallback={
                <div
                    style={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spin size="large" tip="Loading..." />
                </div>
            }
        >
            <Routes>
                {/* Route for client */}
                <Route
                    path="/*"
                    element={
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <LayoutClient>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route
                                        path="/rescue-seeker"
                                        element={<RescueSeeker />}
                                    />
                                    <Route
                                        path="/rescue-history"
                                        element={<RescueHistory />}
                                    />
                                    <Route path="/news" element={<News />} />
                                    <Route
                                        path="/problem"
                                        element={<Problem />}
                                    />
                                    <Route
                                        path="/incident"
                                        element={<Incident />}
                                    />
                                    <Route
                                        path="/infomation-user"
                                        element={<InforUser />}
                                    />
                                    <Route
                                        path="/history-incedent"
                                        element={<HistoryProlem />}
                                    />
                                </Routes>
                            </LayoutClient>
                        </motion.div>
                    }
                />

                {/* Route public */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Route for admin */}
                <Route
                    path="/admin/*"
                    element={
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <LayoutAdmin>
                                <Routes>
                                    <Route
                                        path="/natural-disaster"
                                        element={
                                            <AuthenticatedAdminNaturalDisaster />
                                        }
                                    />
                                    <Route
                                        path="/problem"
                                        element={<AuthenticatedAdminProblem />}
                                    />
                                    <Route
                                        path="/user"
                                        element={<AuthenticatedAdminUser />}
                                    />
                                    <Route
                                        path="/employee"
                                        element={<AuthenticatedAdminEmployee />}
                                    />
                                    <Route
                                        path="/history-natural-disaster"
                                        element={
                                            <AuthenticatedAdminHistoryNatural />
                                        }
                                    />
                                    <Route
                                        path="/history-problem"
                                        element={
                                            <AuthenticatedAdminHistoryProblem />
                                        }
                                    />
                                    <Route
                                        path="/problem-incident"
                                        element={
                                            <AuthenticatedAdminProblemIncident />
                                        }
                                    />
                                </Routes>
                            </LayoutAdmin>
                        </motion.div>
                    }
                />

                {/* Route 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}

export default App;
