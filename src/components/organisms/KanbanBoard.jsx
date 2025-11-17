import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import DealCard from "@/components/molecules/DealCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { stageService } from "@/services/api/stageService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";

const KanbanBoard = ({ onEditDeal, onDeleteDeal, refreshTrigger }) => {
  const [stages, setStages] = useState([]);
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [stagesData, dealsData, contactsData] = await Promise.all([
        stageService.getAll(),
        dealService.getAll(),
        contactService.getAll()
      ]);

      setStages(stagesData);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      console.error("Error loading kanban data:", err);
      setError(err.message || "Failed to load pipeline data");
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

  const getStageDeals = (stageName) => {
    return deals.filter(deal => deal.stage === stageName);
  };

  const getStageValue = (stageName) => {
    return getStageDeals(stageName).reduce((sum, deal) => sum + deal.value, 0);
  };

  const getContactForDeal = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  };

  const handleDragOver = (e, stageName) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stageName);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverStage(null);
    }
  };

  const handleDrop = async (e, stageName) => {
    e.preventDefault();
    setDragOverStage(null);

    if (!draggedDeal || draggedDeal.stage === stageName) {
      setDraggedDeal(null);
      return;
    }

    try {
      const updatedDeal = await dealService.updateStage(draggedDeal.Id, stageName);
      
      // Update local state
      setDeals(prev => prev.map(deal => 
        deal.Id === updatedDeal.Id ? updatedDeal : deal
      ));

      // Log activity
      await activityService.create({
        type: "note",
        contactId: draggedDeal.contactId,
        dealId: draggedDeal.Id,
        description: `Deal moved from ${draggedDeal.stage} to ${stageName}`
      });

      toast.success(`Deal moved to ${stageName}`);
    } catch (error) {
      console.error("Error updating deal stage:", error);
      toast.error("Failed to update deal stage");
    } finally {
      setDraggedDeal(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  if (loading) {
    return <Loading className="min-h-96" />;
  }

  if (error) {
    return (
      <ErrorView
        error={error}
        onRetry={loadData}
        className="min-h-96"
      />
    );
  }

  if (stages.length === 0) {
    return (
      <Empty
        title="No pipeline stages found"
        description="Create stages to start managing your sales pipeline."
        icon="Target"
        showAction={false}
      />
    );
  }

  return (
    <div className="h-full flex space-x-6 overflow-x-auto pb-6 custom-scrollbar">
      {stages.filter(stage => stage.name !== "Closed Won" && stage.name !== "Closed Lost").map((stage) => {
        const stageDeals = getStageDeals(stage.name);
        const stageValue = getStageValue(stage.name);
        const isDragOver = dragOverStage === stage.name;

        return (
          <div
            key={stage.Id}
            className={cn(
              "flex-shrink-0 w-80 bg-gray-50 rounded-xl transition-all duration-200",
              isDragOver && "drag-over"
            )}
            onDragOver={(e) => handleDragOver(e, stage.name)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.name)}
          >
            {/* Stage Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {stageDeals.length}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(stageValue)}
              </div>
            </div>

            {/* Deals List */}
            <div className="p-4 space-y-3 h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
              {stageDeals.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-center">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <ApperIcon name="Target" size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No deals in this stage</p>
                  </div>
                </div>
              ) : (
                stageDeals.map((deal) => {
                  const contact = getContactForDeal(deal.contactId);
                  const isDragging = draggedDeal?.Id === deal.Id;

                  return (
                    <div
                      key={deal.Id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "cursor-move transition-all duration-200",
                        isDragging && "opacity-50"
                      )}
                    >
                      <DealCard
                        deal={deal}
                        contact={contact}
                        isDragging={isDragging}
                        onEdit={onEditDeal}
                        onDelete={onDeleteDeal}
                        className="hover:shadow-md"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}

      {/* Closed Deals Section */}
      <div className="flex space-x-6">
        {/* Closed Won */}
        <div className="flex-shrink-0 w-80 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <div className="p-4 border-b border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <h3 className="font-semibold text-green-900">Closed Won</h3>
              </div>
              <span className="text-sm font-medium text-green-700">
                {getStageDeals("Closed Won").length}
              </span>
            </div>
            <div className="text-sm text-green-700 font-medium">
              {formatCurrency(getStageValue("Closed Won"))}
            </div>
          </div>
          <div className="p-4 space-y-3 h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
            {getStageDeals("Closed Won").map((deal) => {
              const contact = getContactForDeal(deal.contactId);
              return (
                <DealCard
                  key={deal.Id}
                  deal={deal}
                  contact={contact}
                  onEdit={onEditDeal}
                  onDelete={onDeleteDeal}
                  className="bg-white/80 border-green-200"
                />
              );
            })}
          </div>
        </div>

        {/* Closed Lost */}
        <div className="flex-shrink-0 w-80 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
          <div className="p-4 border-b border-red-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <h3 className="font-semibold text-red-900">Closed Lost</h3>
              </div>
              <span className="text-sm font-medium text-red-700">
                {getStageDeals("Closed Lost").length}
              </span>
            </div>
            <div className="text-sm text-red-700">
              {formatCurrency(getStageValue("Closed Lost"))}
            </div>
          </div>
          <div className="p-4 space-y-3 h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
            {getStageDeals("Closed Lost").map((deal) => {
              const contact = getContactForDeal(deal.contactId);
              return (
                <DealCard
                  key={deal.Id}
                  deal={deal}
                  contact={contact}
                  onEdit={onEditDeal}
                  onDelete={onDeleteDeal}
                  className="bg-white/80 border-red-200"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;