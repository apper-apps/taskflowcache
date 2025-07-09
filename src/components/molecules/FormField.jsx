import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder,
  options = [],
  rows = 3,
  ...props 
}) => {
  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            error={!!error}
            rows={rows}
            {...props}
          />
        );
      case "select":
        return (
          <Select
            name={name}
            value={value}
            onChange={onChange}
            error={!!error}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      default:
        return (
          <Input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            error={!!error}
            {...props}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label required={required}>
        {label}
      </Label>
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;