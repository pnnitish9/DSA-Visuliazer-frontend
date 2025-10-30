import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./UserAccount.css";

function UserAccount() {
  const { token, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const nav = useNavigate();

  // ✅ Fetch user details
  useEffect(() => {
    if (!token) return;
    axios
      .get("https://dsa-visuliazer-backend.vercel.app/api/useraccount", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data.user);
        setFormData(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        showPopup("Failed to load user data", "error");
      });
  }, [token]);

  // ✅ Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save updated details
  const handleSave = async () => {
    try {
      const res = await axios.put(
        "https://dsa-visuliazer-backend.vercel.app/api/useraccount",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(res.data.user);
      setEditing(false);
      showPopup("Profile updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showPopup("Failed to update account", "error");
    }
  };

  // ✅ Delete account confirmed
  const confirmDeleteAccount = async () => {
    try {
      const res = await axios.delete("https://dsa-visuliazer-backend.vercel.app/api/useraccount", {
        headers: { Authorization: `Bearer ${token}` },
      });
      showPopup("Account deleted successfully", "success");
      setConfirmDelete(false);
      setTimeout(() => {
        logout();
        nav("/register");
      }, 1500);
    } catch (err) {
      console.error(err);
      showPopup("Failed to delete account", "error");
    }
  };

  // ✅ Helper to show popup
  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2000);
  };

  if (loading) return <div className="user-account-container">Loading...</div>;
  if (!userData) return <div className="user-account-container">No user data found</div>;

  return (
    <div className="user-account-container">
      <h2>User Account</h2>

      <div className="user-info">
        <label>Name:</label>
        <input
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          disabled={!editing}
        />

        <label>Email:</label>
        <input
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          disabled
        />

        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender || ""}
          onChange={handleChange}
          disabled={!editing}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob?.slice(0, 10) || ""}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>

      <div className="user-actions">
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-primary">
            Edit
          </button>
        ) : (
          <button onClick={handleSave} className="btn-primary">
            Save
          </button>
        )}
        <button onClick={() => setConfirmDelete(true)} className="btn-danger">
          Delete Account
        </button>
      </div>

      {/* ✅ Toast Popup */}
      {popup.show && (
        <div className={`popup ${popup.type}`}>
          <p>{popup.message}</p>
        </div>
      )}

      {/* ⚠️ Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Account?</h3>
            <p>This action cannot be undone. Are you sure?</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDeleteAccount}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAccount;
