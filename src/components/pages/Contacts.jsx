import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import ContactCard from "@/components/molecules/ContactCard";
import ContactForm from "@/components/organisms/ContactForm";
import ContactDetail from "@/components/organisms/ContactDetail";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [showContactForm, setShowContactForm] = useState(false);
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or table

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [contacts, searchTerm, sortBy, filterBy]);

  const loadContacts = async () => {
    setLoading(true);
    setError("");

    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (err) {
      console.error("Error loading contacts:", err);
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSorting = () => {
    let filtered = [...contacts];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.company.toLowerCase().includes(search) ||
        contact.position.toLowerCase().includes(search) ||
        contact.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Apply category filter
    if (filterBy !== "all") {
      filtered = filtered.filter(contact => {
        if (filterBy === "enterprise") {
          return contact.tags.some(tag => tag.toLowerCase().includes("enterprise"));
        }
        if (filterBy === "startup") {
          return contact.tags.some(tag => tag.toLowerCase().includes("startup"));
        }
        if (filterBy === "agency") {
          return contact.tags.some(tag => tag.toLowerCase().includes("agency"));
        }
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "company":
          return a.company.localeCompare(b.company);
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "updated":
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        default:
          return 0;
      }
    });

    setFilteredContacts(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowContactForm(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowContactForm(true);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowContactDetail(true);
  };

  const handleDeleteContact = async (contact) => {
    if (!confirm(`Are you sure you want to delete ${contact.name}?`)) {
      return;
    }

    try {
      await contactService.delete(contact.Id);
      setContacts(prev => prev.filter(c => c.Id !== contact.Id));
      toast.success("Contact deleted successfully!");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  const handleContactSaved = (savedContact) => {
    if (selectedContact) {
      // Update existing contact
      setContacts(prev => prev.map(c => 
        c.Id === savedContact.Id ? savedContact : c
      ));
    } else {
      // Add new contact
      setContacts(prev => [...prev, savedContact]);
    }
  };

  const getAllTags = () => {
    const tagSet = new Set();
    contacts.forEach(contact => {
      contact.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  };

  if (loading) {
    return (
      <div className="h-full">
        <Header title="Contacts" subtitle={`${contacts.length} contacts`} />
        <Loading className="min-h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <Header title="Contacts" subtitle={`${contacts.length} contacts`} />
        <ErrorView error={error} onRetry={loadContacts} className="min-h-96" />
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      <Header 
        title="Contacts" 
        subtitle={`${filteredContacts.length} of ${contacts.length} contacts`}
        onSearch={handleSearch}
        onAdd={handleAddContact}
        addLabel="Add Contact"
      />

      <div className="p-6">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-40"
            >
              <option value="name">Sort by Name</option>
              <option value="company">Sort by Company</option>
              <option value="created">Sort by Created</option>
              <option value="updated">Sort by Updated</option>
            </Select>

            <Select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-40"
            >
              <option value="all">All Contacts</option>
              <option value="enterprise">Enterprise</option>
              <option value="startup">Startup</option>
              <option value="agency">Agency</option>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <ApperIcon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === "table" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <ApperIcon name="List" size={16} />
            </Button>
          </div>
        </div>

        {/* Tags Filter */}
        {getAllTags().length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Tags</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={filterBy === "all" ? "primary" : "default"}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setFilterBy("all")}
              >
                All Tags
              </Badge>
              {getAllTags().slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => setSearchTerm(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {filteredContacts.length === 0 ? (
          searchTerm || filterBy !== "all" ? (
            <Empty
              title="No contacts found"
              description={`No contacts match your current search or filter criteria.`}
              icon="Users"
              onAction={() => {
                setSearchTerm("");
                setFilterBy("all");
              }}
              actionLabel="Clear Filters"
            />
          ) : (
            <Empty
              title="No contacts yet"
              description="Start building your contact database by adding your first contact."
              icon="Users"
              onAction={handleAddContact}
              actionLabel="Add First Contact"
            />
          )
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact.Id}
                    contact={contact}
                    onClick={handleViewContact}
                    showActions={true}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company & Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tags
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredContacts.map((contact) => (
                        <tr key={contact.Id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewContact(contact)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                                {contact.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{contact.company}</div>
                            <div className="text-sm text-gray-500">{contact.position}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{contact.email}</div>
                            <div className="text-sm text-gray-500">{contact.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {contact.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="primary" size="sm">
                                  {tag}
                                </Badge>
                              ))}
                              {contact.tags.length > 2 && (
                                <Badge variant="default" size="sm">
                                  +{contact.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditContact(contact);
                                }}
                              >
                                <ApperIcon name="Edit" size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteContact(contact);
                                }}
                              >
                                <ApperIcon name="Trash2" size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ContactForm
        isOpen={showContactForm}
        onClose={() => {
          setShowContactForm(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
        onSave={handleContactSaved}
      />

      <ContactDetail
        isOpen={showContactDetail}
        onClose={() => {
          setShowContactDetail(false);
          setSelectedContact(null);
        }}
        contactId={selectedContact?.Id}
        onEdit={(contact) => {
          setShowContactDetail(false);
          handleEditContact(contact);
        }}
      />
    </div>
  );
};

export default Contacts;