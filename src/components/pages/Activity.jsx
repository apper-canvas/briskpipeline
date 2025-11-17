import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import ActivityItem from "@/components/molecules/ActivityItem";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { format, isToday, isYesterday, subDays, isAfter } from "date-fns";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    loadActivityData();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [activities, filterBy, sortBy, selectedDate]);

  const loadActivityData = async () => {
    setLoading(true);
    setError("");

    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);

      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      console.error("Error loading activity data:", err);
      setError(err.message || "Failed to load activity data");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSorting = () => {
    let filtered = [...activities];

    // Apply type filter
    if (filterBy !== "all") {
      filtered = filtered.filter(activity => activity.type === filterBy);
    }

    // Apply date filter
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return format(activityDate, 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd');
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.timestamp) - new Date(a.timestamp);
        case "oldest":
          return new Date(a.timestamp) - new Date(b.timestamp);
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    setFilteredActivities(filtered);
  };

  const getContactForActivity = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const getDealForActivity = (dealId) => {
    return deals.find(deal => deal.Id === dealId);
  };

  const getActivityTypeStats = () => {
    const stats = {};
    activities.forEach(activity => {
      stats[activity.type] = (stats[activity.type] || 0) + 1;
    });
    return stats;
  };

  const getRecentActivityStats = () => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const weekAgo = subDays(today, 7);
    
    const todayCount = activities.filter(a => isToday(new Date(a.timestamp))).length;
    const yesterdayCount = activities.filter(a => isYesterday(new Date(a.timestamp))).length;
    const weekCount = activities.filter(a => isAfter(new Date(a.timestamp), weekAgo)).length;
    
    return { todayCount, yesterdayCount, weekCount };
  };

  const groupActivitiesByDate = (activities) => {
    const groups = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.timestamp);
      let dateKey;
      
      if (isToday(date)) {
        dateKey = "Today";
      } else if (isYesterday(date)) {
        dateKey = "Yesterday";
      } else {
        dateKey = format(date, 'MMMM d, yyyy');
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });
    
    return groups;
  };

  const activityTypeStats = getActivityTypeStats();
  const recentStats = getRecentActivityStats();
  const groupedActivities = groupActivitiesByDate(filteredActivities);

  if (loading) {
    return (
      <div className="h-full">
        <Header title="Activity" subtitle={`${activities.length} activities`} showSearch={false} showAdd={false} />
        <Loading className="min-h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <Header title="Activity" subtitle={`${activities.length} activities`} showSearch={false} showAdd={false} />
        <ErrorView error={error} onRetry={loadActivityData} className="min-h-96" />
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      <Header 
        title="Activity Feed" 
        subtitle={`${filteredActivities.length} of ${activities.length} activities`}
        showSearch={false}
        showAdd={false}
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Today</span>
                  <Badge variant="primary">{recentStats.todayCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Yesterday</span>
                  <Badge variant="default">{recentStats.yesterdayCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Week</span>
                  <Badge variant="info">{recentStats.weekCount}</Badge>
                </div>
              </div>
            </Card>

            {/* Activity Type Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">By Type</h3>
              <div className="space-y-3">
                {Object.entries(activityTypeStats).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ApperIcon 
                        name={
                          type === "call" ? "Phone" :
                          type === "email" ? "Mail" :
                          type === "meeting" ? "Calendar" :
                          type === "note" ? "FileText" :
                          "Activity"
                        } 
                        size={16} 
                        className="text-gray-400" 
                      />
                      <span className="text-sm text-gray-600 capitalize">{type}</span>
                    </div>
                    <Badge variant="default">{count}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Filters */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              <div className="space-y-4">
                <Select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  label="Activity Type"
                >
                  <option value="all">All Types</option>
                  <option value="call">Calls</option>
                  <option value="email">Emails</option>
                  <option value="meeting">Meetings</option>
                  <option value="note">Notes</option>
                </Select>

                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="type">By Type</option>
                </Select>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  />
                </div>

                {(filterBy !== "all" || sortBy !== "recent" || selectedDate) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilterBy("all");
                      setSortBy("recent");
                      setSelectedDate("");
                    }}
                    className="w-full"
                  >
                    <ApperIcon name="X" size={14} className="mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredActivities.length === 0 ? (
              filterBy !== "all" || selectedDate ? (
                <Empty
                  title="No activities found"
                  description="No activities match your current filter criteria."
                  icon="Activity"
                  onAction={() => {
                    setFilterBy("all");
                    setSelectedDate("");
                  }}
                  actionLabel="Clear Filters"
                />
              ) : (
                <Empty
                  title="No activity yet"
                  description="Activity will appear here as you interact with contacts and deals."
                  icon="Activity"
                  showAction={false}
                />
              )
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedActivities).map(([dateGroup, dayActivities]) => (
                  <Card key={dateGroup}>
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 -mx-6 -mt-6 mb-6 rounded-t-xl">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-lg font-semibold text-gray-900">{dateGroup}</h2>
                        <Badge variant="primary">{dayActivities.length} activities</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {dayActivities.map((activity) => {
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
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;