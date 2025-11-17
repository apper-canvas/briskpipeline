import React, { useState, useEffect } from "react";
import Modal from "@/components/molecules/Modal";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ActivityItem from "@/components/molecules/ActivityItem";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { format } from "date-fns";

const ContactDetail = ({ isOpen, onClose, contactId, onEdit }) => {
  const [contact, setContact] = useState(null);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && contactId) {
      loadContactData();
    }
  }, [isOpen, contactId]);

  const loadContactData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [contactData, dealsData, activitiesData] = await Promise.all([
        contactService.getById(contactId),
        dealService.getByContactId(contactId),
        activityService.getByContactId(contactId)
      ]);
      
      setContact(contactData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      console.error("Error loading contact data:", err);
      setError(err.message || "Failed to load contact data");
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

  const getStageColor = (stage) => {
    const variants = {
      "Lead": "default",
      "Qualified": "info",
      "Proposal": "warning",
      "Negotiation": "primary",
      "Closed Won": "success",
      "Closed Lost": "error"
    };
    return variants[stage] || "default";
  };

  const tabs = [
    { id: "info", label: "Contact Info", icon: "User" },
    { id: "deals", label: "Deals", icon: "Target", count: deals.length },
    { id: "activity", label: "Activity", icon: "Activity", count: activities.length }
  ];

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      className="max-h-[90vh] flex flex-col"
    >
      {loading && <Loading className="py-12" />}
      
      {error && (
        <ErrorView
          error={error}
          onRetry={loadContactData}
          className="py-12"
        />
      )}
      
      {!loading && !error && contact && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Avatar initials={contact.name} size="xl" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{contact.name}</h2>
                <p className="text-lg text-gray-600">{contact.position}</p>
                <p className="text-sm text-gray-500">{contact.company}</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => onEdit?.(contact)}
            >
              <ApperIcon name="Edit" size={16} className="mr-2" />
              Edit Contact
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        activeTab === tab.id 
                          ? "bg-primary/10 text-primary" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6">
              {activeTab === "info" && (
                <div className="space-y-6">
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Mail" size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900">{contact.email}</p>
                          </div>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center space-x-3">
                            <ApperIcon name="Phone" size={16} className="text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="text-sm font-medium text-gray-900">{contact.phone}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Building" size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Company</p>
                            <p className="text-sm font-medium text-gray-900">{contact.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Briefcase" size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Position</p>
                            <p className="text-sm font-medium text-gray-900">{contact.position}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {contact.tags && contact.tags.length > 0 && (
                    <Card>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {contact.tags.map((tag, index) => (
                          <Badge key={index} variant="primary">{tag}</Badge>
                        ))}
                      </div>
                    </Card>
                  )}

                  {contact.notes && (
                    <Card>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                      <p className="text-gray-700 leading-relaxed">{contact.notes}</p>
                    </Card>
                  )}

                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm">
                        <ApperIcon name="Plus" size={16} className="text-green-600" />
                        <span className="text-gray-500">Created on</span>
                        <span className="font-medium text-gray-900">
                          {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <ApperIcon name="Edit" size={16} className="text-blue-600" />
                        <span className="text-gray-500">Last updated on</span>
                        <span className="font-medium text-gray-900">
                          {format(new Date(contact.updatedAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "deals" && (
                <div className="space-y-4">
                  {deals.length === 0 ? (
                    <Empty
                      title="No deals found"
                      description="This contact doesn't have any deals yet."
                      icon="Target"
                      showAction={false}
                    />
                  ) : (
                    deals.map((deal) => (
                      <Card key={deal.Id} hover>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{deal.title}</h4>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xl font-bold text-gray-900">
                                {formatCurrency(deal.value)}
                              </span>
                              <Badge variant={getStageColor(deal.stage)}>
                                {deal.stage}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {deal.probability}% probability
                              </span>
                            </div>
                            {deal.expectedCloseDate && (
                              <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                                <ApperIcon name="Calendar" size={14} />
                                <span>Expected close: {format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {deal.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">{deal.notes}</p>
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <Empty
                      title="No activity found"
                      description="No activities have been logged for this contact yet."
                      icon="Activity"
                      showAction={false}
                    />
                  ) : (
                    <div className="space-y-2">
                      {activities.map((activity) => {
                        const relatedDeal = activity.dealId 
                          ? deals.find(d => d.Id === activity.dealId)
                          : null;
                        
                        return (
                          <ActivityItem
                            key={activity.Id}
                            activity={activity}
                            deal={relatedDeal}
                            showDetails={false}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ContactDetail;