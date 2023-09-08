import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "@/components/Home";
import { Input } from "@/components/ui/input";

export default function AppRouter() {
  const [name, setName] = useState(localStorage.getItem("name"));
  return name ? (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/meeting" element={<Home />} />
    </Routes>
  ) : (
    <>
      <Input
        placeholder="Enter your name"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            localStorage.setItem("name", e.currentTarget.value);
            setName(e.currentTarget.value);
          }
        }}
      />
    </>
  );
}
