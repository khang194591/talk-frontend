// import { useAuth0 } from "@auth0/auth0-react";
// import { Button, Input, Spin } from "antd";
// import { useState } from "react";
// import { Route, Routes } from "react-router-dom";
// import Home from "../components/Home";
// import Room from "../components/Room";

// export default function AppRouter() {
//   const { loginWithPopup, user, isLoading } = useAuth0();
//   const [name, setName] = useState("");
//   return isLoading ? (
//     <Spin />
//   ) : user || name ? (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/:roomId" element={<Room />} />
//     </Routes>
//   ) : (
//     <>
//       <Button onClick={() => loginWithPopup()} type="primary" size="large">
//         Sign in
//       </Button>
//       <Input
//         size="large"
//         placeholder="Enter your name"
//         onPressEnter={(e) => setName(e.currentTarget.value)}
//       />
//     </>
//   );
// }
