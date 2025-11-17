import React, { useState } from "react";
import Header from "@/components/organisms/Header";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import DealForm from "@/components/organisms/DealForm";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";

const Pipeline = () => {
  const [showDealForm, setShowDealForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setShowDealForm(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowDealForm(true);
  };

  const handleDeleteDeal = async (deal) => {
    if (!confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      return;
    }

    try {
      await dealService.delete(deal.Id);
      
      // Log activity
      await activityService.create({
        type: "note",
        contactId: deal.contactId,
        dealId: null,
        description: `Deal "${deal.title}" was deleted`
      });

      toast.success("Deal deleted successfully!");
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast.error("Failed to delete deal");
    }
  };

  const handleDealSaved = (savedDeal) => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="h-full bg-gray-50">
      <Header 
        title="Sales Pipeline" 
        subtitle="Manage deals through your sales process"
        onAdd={handleAddDeal}
        addLabel="Add Deal"
        showSearch={false}
      />
      
      <div className="p-6 h-[calc(100vh-5rem)] overflow-hidden">
        <KanbanBoard
          onEditDeal={handleEditDeal}
          onDeleteDeal={handleDeleteDeal}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <DealForm
        isOpen={showDealForm}
        onClose={() => {
          setShowDealForm(false);
          setSelectedDeal(null);
        }}
        deal={selectedDeal}
        onSave={handleDealSaved}
      />
    </div>
  );
};

export default Pipeline;