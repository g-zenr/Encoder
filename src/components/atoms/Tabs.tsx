import React from "react";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  className = "",
}) => (
  <div className={`flex border-b mb-4 ${className}`}>
    {tabs.map((tab) => (
      <button
        key={tab.value}
        className={`px-6 py-2 font-medium focus:outline-none transition-colors border-b-2 -mb-px ${
          value === tab.value
            ? "border-black text-black bg-gray-100"
            : "border-transparent text-gray-500 hover:text-black"
        }`}
        onClick={() => onChange(tab.value)}
        type="button"
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default Tabs;
