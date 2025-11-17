import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import MetricCard from "@/components/molecules/MetricCard";
import Card from "@/components/atoms/Card";
import ActivityItem from "@/components/molecules/ActivityItem";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { activityService } from "@/services/api/activityService";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [metricsData, activitiesData, contactsData, dealsData] = await Promise.all([
        dealService.getPipelineMetrics(),
        activityService.getRecent(8),
        contactService.getAll(),
        dealService.getAll()
      ]);

      setMetrics(metricsData);
      setRecentActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getContactForActivity = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const getDealForActivity = (dealId) => {
    return deals.find(deal => deal.Id === dealId);
  };

  const getPipelineChartData = () => {
    if (!metrics) return { options: {}, series: [] };

    const stageNames = Object.keys(metrics.stageBreakdown);
    const stageValues = Object.values(metrics.stageBreakdown).map(stage => stage.value);

    const options = {
      chart: {
        type: 'donut',
        height: 300,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false }
      },
      colors: ['#4F46E5', '#7C3AED', '#F59E0B', '#10B981', '#EF4444', '#6B7280'],
      labels: stageNames,
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return formatCurrency(stageValues[opts.seriesIndex]);
        }
      },
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 500
      },
      plotOptions: {
        pie: {
          donut: {
            size: '60%'
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return formatCurrency(val);
          }
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    return { options, series: stageValues };
  };

  if (loading) {
    return (
      <div className="h-full">
        <Header title="Dashboard" subtitle="Sales pipeline overview" showSearch={false} showAdd={false} />
        <Loading className="min-h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <Header title="Dashboard" subtitle="Sales pipeline overview" showSearch={false} showAdd={false} />
        <ErrorView error={error} onRetry={loadDashboardData} className="min-h-96" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="h-full">
        <Header title="Dashboard" subtitle="Sales pipeline overview" showSearch={false} showAdd={false} />
        <Empty
          title="No data available"
          description="Start by adding contacts and deals to see your dashboard metrics."
          icon="BarChart3"
          showAction={false}
        />
      </div>
    );
  }

  const chartData = getPipelineChartData();

  return (
    <div className="h-full bg-gray-50">
      <Header 
        title="Dashboard" 
        subtitle="Sales pipeline overview"
        showSearch={false}
        showAdd={false}
      />
      
      <div className="p-6 space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Pipeline Value"
            value={formatCurrency(metrics.totalValue)}
            icon="DollarSign"
            iconColor="text-green-600"
            change={12}
            changeType="positive"
          />
          <MetricCard
            title="Active Deals"
            value={metrics.activeDeals}
            icon="Target"
            iconColor="text-blue-600"
            change={5}
            changeType="positive"
          />
          <MetricCard
            title="Win Rate"
            value={`${metrics.winRate.toFixed(1)}%`}
            icon="TrendingUp"
            iconColor="text-purple-600"
            change={2.3}
            changeType="positive"
          />
          <MetricCard
            title="Average Deal Size"
            value={formatCurrency(metrics.averageDealSize)}
            icon="Calculator"
            iconColor="text-orange-600"
            change={-1.2}
            changeType="negative"
          />
        </div>

        {/* Charts and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline Chart */}
          <Card className="h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Pipeline by Stage</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ApperIcon name="PieChart" size={16} />
                <span>Deal Value Distribution</span>
              </div>
            </div>
            {chartData.series.length > 0 ? (
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="donut"
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <ApperIcon name="PieChart" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No pipeline data available</p>
                </div>
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          <Card className="h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ApperIcon name="Activity" size={16} />
                <span>Latest Updates</span>
              </div>
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
              {recentActivities.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-center">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <ApperIcon name="Activity" size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No recent activity</p>
                  </div>
                </div>
              ) : (
                recentActivities.map((activity) => {
                  const contact = getContactForActivity(activity.contactId);
                  const deal = getDealForActivity(activity.dealId);
                  
                  return (
                    <ActivityItem
                      key={activity.Id}
                      activity={activity}
                      contact={contact}
                      deal={deal}
                      showDetails={true}
                      className="hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                    />
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Pipeline Summary */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Pipeline Summary</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <ApperIcon name="BarChart3" size={16} />
              <span>Stage Breakdown</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(metrics.stageBreakdown).map(([stage, data]) => (
              <div key={stage} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{stage}</h3>
                  <span className="text-sm font-medium text-gray-600">{data.count} deals</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary to-secondary bg-clip-text">
                  {formatCurrency(data.value)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Avg: {formatCurrency(data.count > 0 ? data.value / data.count : 0)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;