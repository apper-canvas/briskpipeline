import React, { useState, useEffect } from "react";
import Modal from "@/components/molecules/Modal";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const ContactForm = ({ isOpen, onClose, contact = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    tags: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        position: contact.position || "",
        tags: contact.tags ? contact.tags.join(", ") : "",
        notes: contact.notes || ""
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        tags: "",
        notes: ""
      });
    }
    setErrors({});
  }, [contact, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
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
      const contactData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      };

      let savedContact;
      if (contact) {
        savedContact = await contactService.update(contact.Id, contactData);
        toast.success("Contact updated successfully!");
      } else {
        savedContact = await contactService.create(contactData);
        toast.success("Contact created successfully!");
      }

      onSave?.(savedContact);
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error(error.message || "Failed to save contact");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contact ? "Edit Contact" : "Add New Contact"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={handleChange("name")}
            error={errors.name}
            placeholder="Enter full name"
            leftIcon={<ApperIcon name="User" size={16} className="text-gray-400" />}
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            error={errors.email}
            placeholder="Enter email address"
            leftIcon={<ApperIcon name="Mail" size={16} className="text-gray-400" />}
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
            placeholder="Enter phone number"
            leftIcon={<ApperIcon name="Phone" size={16} className="text-gray-400" />}
          />

          <Input
            label="Company"
            value={formData.company}
            onChange={handleChange("company")}
            error={errors.company}
            placeholder="Enter company name"
            leftIcon={<ApperIcon name="Building" size={16} className="text-gray-400" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Position"
            value={formData.position}
            onChange={handleChange("position")}
            error={errors.position}
            placeholder="Enter job position"
            leftIcon={<ApperIcon name="Briefcase" size={16} className="text-gray-400" />}
          />

          <Input
            label="Tags"
            value={formData.tags}
            onChange={handleChange("tags")}
            error={errors.tags}
            placeholder="Enter tags (comma-separated)"
            hint="Separate multiple tags with commas"
            leftIcon={<ApperIcon name="Tag" size={16} className="text-gray-400" />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={handleChange("notes")}
            placeholder="Enter any additional notes about this contact..."
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
                {contact ? "Update Contact" : "Create Contact"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactForm;