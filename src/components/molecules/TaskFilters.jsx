import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const TaskFilters = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onClearSearch,
  categories = [] 
}) => {
  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  const statusOptions = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" }
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map(cat => ({ value: cat.Id.toString(), label: cat.name }))
  ];

  const handleClearFilters = () => {
    onFilterChange({
      status: "all",
      priority: "",
      category: "",
      search: ""
    });
    onClearSearch();
  };

  const hasActiveFilters = filters.status !== "all" || filters.priority || filters.category || filters.search;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="flex-1 w-full lg:w-auto">
          <SearchBar
            onSearch={onSearch}
            onClear={onClearSearch}
            placeholder="Search tasks..."
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="min-w-32"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          
          <Select
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            className="min-w-32"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          
          <Select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="min-w-32"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="shrink-0"
            >
              <ApperIcon name="X" size={16} />
              Clear
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskFilters;