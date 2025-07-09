import { Routes, Route } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import TaskManager from "@/components/pages/TaskManager";
import { ThemeProvider } from "@/contexts/ThemeContext";
function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<TaskManager />} />
          <Route path="/category/:categoryId" element={<TaskManager />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;