import { motion } from "framer-motion";

const Loading = ({ type = "tasks" }) => {
  const renderTaskSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-5 h-5 bg-gradient-to-br from-gray-200 to-gray-300 rounded animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse" />
                <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCategorySkeleton = () => (
    <div className="space-y-3">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="w-5 h-5 bg-gradient-to-br from-gray-200 to-gray-300 rounded animate-pulse" />
          <div className="flex-1 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
          <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse" />
        </motion.div>
      ))}
    </div>
  );

  const renderStatsSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {type === "page" && (
        <>
          {/* Quick Add Bar Skeleton */}
          <motion.div
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="w-24 h-10 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded animate-pulse" />
            </div>
          </motion.div>

          {/* Stats Skeleton */}
          {renderStatsSkeleton()}

          {/* Filter Bar Skeleton */}
          <motion.div
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-48 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="w-32 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="w-20 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
            </div>
          </motion.div>
        </>
      )}

      {type === "tasks" && renderTaskSkeleton()}
      {type === "categories" && renderCategorySkeleton()}
    </div>
  );
};

export default Loading;