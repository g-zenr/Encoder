import React from "react";
import Tabs from "../atoms/Tabs";
import SystemStatus from "../molecules/SystemStatus";
import ActivityLog from "../molecules/ActivityLog";

interface DashboardLayoutProps {
  tabs: { label: string; value: string }[];
  selectedTab: string;
  onTabChange: (value: string) => void;
  systemStatusProps: React.ComponentProps<typeof SystemStatus>;
  activityLogProps: React.ComponentProps<typeof ActivityLog>;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  systemStatusProps,
  activityLogProps,
  children,
}) => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-3xl font-bold mb-1">TTLock Card Encoder</div>
      <div className="text-gray-500 mb-6">
        Professional card encoding system
      </div>
      <Tabs tabs={tabs} value={selectedTab} onChange={onTabChange} />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-0">{children}</div>
        <div className="w-full md:w-80 flex-shrink-0 space-y-4">
          <SystemStatus {...systemStatusProps} />
          <ActivityLog {...activityLogProps} />
        </div>
      </div>
    </div>
  </div>
);

export default DashboardLayout;
