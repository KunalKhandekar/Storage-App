import {
    Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { getShareDashboardInfo } from "../../../Apis/shareApi";
import Header from "./Header";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import Stats from "./Stats";
import DashboardShimmer from "../../../components/ShimmerUI/ShareDashboardShimmer";

export default function Dashboard() {
  const [stats, setStats] = useState({
    sharedWithMe: 0,
    sharedByMe: 0,
    totalUsers: 0,
  });
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getShareDashboardInfo();
      if (res.success) {
        setStats({
          sharedWithMe: res.data.sharedWithMeLength,
          sharedByMe: res.data.sharedByMeLength,
          totalUsers: res.data.collaborators,
        });
        setRecentFiles(res.data.recentFiles);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <DashboardShimmer />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <Header />

          {/* Stats Cards */}
          <Stats stats={stats} />

          {/* Recent Activity */}
          <RecentActivity recentFiles={recentFiles} />

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
