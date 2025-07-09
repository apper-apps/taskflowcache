import { motion } from "framer-motion";
import StatsCard from "@/components/molecules/StatsCard";
import Loading from "@/components/ui/Loading";

const TaskStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: "ListTodo",
      color: "primary"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: "CheckCircle",
      color: "success"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: "Clock",
      color: "warning"
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: "AlertTriangle",
      color: "danger"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatsCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default TaskStats;