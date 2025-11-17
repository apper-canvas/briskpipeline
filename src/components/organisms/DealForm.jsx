import React, { useState, useEffect } from "react";
import Modal from "@/components/molecules/Modal";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { stageService } from "@/services/api/stageService";
import { toast } from "react-toastify";

const DealForm = ({ isOpen, onClose, deal = null, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    contactId: "",
    value: "",
    stage: "",
    probability: "",
    expectedCloseDate: "",
    notes: ""
  });
  const [contacts, setContacts] = useState([]);
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        contactId: deal.contactId?.toString() || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "",
        probability: deal.probability?.toString() || "",
        expectedCloseDate: deal.expectedCloseDate || "",
        notes: deal.notes || ""
      });
    } else {
      setFormData({
        title: "",
        contactId: "",
        value: "",
        stage: "Lead",
        probability: "20",
        expectedCloseDate: "",
        notes: ""
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [contactsData, stagesData] = await Promise.all([
        contactService.getAll(),
        stageService.getAll()
      ]);
      setContacts(contactsData);
      setStages(stagesData);
    } catch (error) {
      console.error("Error loading form data:", error);
      toast.error("Failed to load form data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Contact selection is required";
    }
    
    if (!formData.value.trim()) {
      newErrors.value = "Deal value is required";
    } else if (isNaN(parseFloat(formData.value)) || parseFloat(formData.value) <= 0) {
      newErrors.value = "Please enter a valid positive number";
    }

    if (!formData.stage) {
      newErrors.stage = "Stage selection is required";
    }

    if (!formData.probability.trim()) {
      newErrors.probability = "Probability is required";
    } else {
      const prob = parseInt(formData.probability);
      if (isNaN(prob) || prob < 0 || prob > 100) {
        newErrors.probability = "Probability must be between 0 and 100";
      }
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const dealData = {
        ...formData,
        contactId: parseInt(formData.contactId),
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability)
      };

      let savedDeal;
      if (deal) {
        savedDeal = await dealService.update(deal.Id, dealData);
        toast.success("Deal updated successfully!");
      } else {
        savedDeal = await dealService.create(dealData);
        toast.success("Deal created successfully!");
      }

      onSave?.(savedDeal);
      onClose();
    } catch (error) {
      console.error("Error saving deal:", error);
      toast.error(error.message || "Failed to save deal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    
    // Update probability based on stage selection
    if (field === "stage") {
      const probabilityMap = {
        "Lead": "20",
        "Qualified": "40",
        "Proposal": "60", 
        "Negotiation": "75",
        "Closed Won": "100",
        "Closed Lost": "0"
      };
      setFormData(prev => ({
        ...prev,
        [field]: value,
        probability: probabilityMap[value] || prev.probability
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  if (isLoadingData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Loading...">
        <div className="flex items-center justify-center py-12">
          <ApperIcon name="Loader2" size={32} className="animate-spin text-primary" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? "Edit Deal" : "Add New Deal"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Deal Title"
            value={formData.title}
            onChange={handleChange("title")}
            error={errors.title}
            placeholder="Enter deal title"
            leftIcon={<ApperIcon name="Target" size={16} className="text-gray-400" />}
          />

          <Select
            label="Contact"
            value={formData.contactId}
            onChange={handleChange("contactId")}
            error={errors.contactId}
          >
            <option value="">Select a contact</option>
            {contacts.map((contact) => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name} - {contact.company}
              </option>
            ))}
          </Select>

          <Input
            label="Deal Value"
            type="number"
            value={formData.value}
            onChange={handleChange("value")}
            error={errors.value}
            placeholder="Enter deal value"
            leftIcon={<ApperIcon name="DollarSign" size={16} className="text-gray-400" />}
            step="0.01"
            min="0"
          />

          <Select
            label="Stage"
            value={formData.stage}
            onChange={handleChange("stage")}
            error={errors.stage}
          >
            <option value="">Select a stage</option>
            {stages.filter(stage => !["Closed Won", "Closed Lost"].includes(stage.name)).map((stage) => (
              <option key={stage.Id} value={stage.name}>
                {stage.name}
              </option>
            ))}
          </Select>

          <Input
            label="Probability (%)"
            type="number"
            value={formData.probability}
            onChange={handleChange("probability")}
            error={errors.probability}
            placeholder="Enter probability"
            leftIcon={<ApperIcon name="Percent" size={16} className="text-gray-400" />}
            min="0"
            max="100"
            hint="Probability of closing this deal"
          />

          <Input
            label="Expected Close Date"
            type="date"
            value={formData.expectedCloseDate}
            onChange={handleChange("expectedCloseDate")}
            error={errors.expectedCloseDate}
            leftIcon={<ApperIcon name="Calendar" size={16} className="text-gray-400" />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={handleChange("notes")}
            placeholder="Enter any notes about this deal..."
            rows={4}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 hover:border-gray-400 resize-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                {deal ? "Update Deal" : "Create Deal"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DealForm;