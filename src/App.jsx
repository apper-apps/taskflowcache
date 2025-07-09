import { Routes, Route } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import TaskManager from "@/components/pages/TaskManager";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TaskManager />} />
        <Route path="/category/:categoryId" element={<TaskManager />} />
      </Routes>
    </Layout>
  );
}

export default App;