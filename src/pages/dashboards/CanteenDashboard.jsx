import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../components/ui/DashboardCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ChartComponent from '../../components/charts/ChartComponent';
import Button from '../../components/ui/Button';
import {
  fetchTodaysSurplus,
  fetchCanteenSurplusPosts,
  fetchAnalytics,
} from '../../utils/api';

const CanteenDashboard = () => {
  const [todaySurplus, setTodaySurplus] = useState(0);
  const [posts, setPosts] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    async function load() {
      const [surplus, recentPosts, analytics] = await Promise.all([
        fetchTodaysSurplus(),
        fetchCanteenSurplusPosts(),
        fetchAnalytics(),
      ]);
      setTodaySurplus(surplus);
      setPosts(recentPosts);
      setWeeklyData(analytics.weeklySurplusData);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-semibold text-secondary">Canteen Dashboard</h1>
          <p className="text-xs text-gray-500">
            View today&apos;s AI predicted surplus and manage your surplus posts.
          </p>
        </div>
        <Button as={Link} to="/canteen/add-surplus" className="w-full md:w-auto">
          Add Surplus Food
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="Today&apos;s AI Predicted Surplus"
          value={`${todaySurplus} kg`}
          subtitle="Based on historical patterns and live signals (mock)"
        />
        <DashboardCard
          title="Active Surplus Posts"
          value={posts.filter((p) => p.status !== 'Delivered').length}
          subtitle="Awaiting NGO assignment or pickup"
        />
        <DashboardCard
          title="Meals Saved This Week"
          value={320}
          subtitle="Estimated from delivered surplus"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="mb-3 flex items-center justify-between text-xs">
            <p className="font-medium text-secondary">Recent Surplus Posts</p>
            <span className="text-gray-400">Mock data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] text-gray-500">
                  <th className="py-2 pr-4 font-medium">Food</th>
                  <th className="py-2 pr-4 font-medium">Quantity</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-50 text-[11px]">
                    <td className="py-2 pr-4 font-medium text-gray-800">
                      {post.foodName}
                    </td>
                    <td className="py-2 pr-4 text-gray-600">{post.quantity}</td>
                    <td className="py-2 pr-4">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="py-2 pr-4 text-gray-500">{post.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <p className="mb-2 text-xs font-medium text-secondary">
            Weekly Surplus (kg)
          </p>
          <ChartComponent type="bar" data={weeklyData} dataKey="value" nameKey="name" />
        </div>
      </div>
    </div>
  );
};

export default CanteenDashboard;
