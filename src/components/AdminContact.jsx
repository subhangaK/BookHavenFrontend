import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminContact = () => {
  const { token } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7189/api/Auth/contacts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const mappedContacts = response.data.map((contact) => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          message: contact.message,
          // Add more fields based on your Contacts table schema, e.g., phone, createdAt
        }));

        setContacts(mappedContacts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast.error("Failed to fetch contacts. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
      }
    };

    fetchContacts();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Contact Information
          </h1>
        </header>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                {/* Add more columns based on your Contacts table schema */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{contact.id}</td>
                    <td className="px-6 py-4">{contact.name || "N/A"}</td>
                    <td className="px-6 py-4">{contact.email || "N/A"}</td>
                    <td className="px-6 py-4">{contact.message || "N/A"}</td>
                    {/* Add more fields as needed */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No contact information found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-gray-500 text-sm">
          Showing {contacts.length} contact{contacts.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
