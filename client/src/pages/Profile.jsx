import { useState } from "react";
import api from "../api";
import { useSession } from "../contexts/SessionContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, setUser } = useSession();

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Change email state
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const response = await api.put("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setPasswordMessage(response.data.message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Error updating password");
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailMessage("");
    setEmailError("");

    try {
      const response = await api.put("/api/auth/change-email", {
        newEmail,
        currentPassword: emailPassword,
      });
      setEmailMessage(response.data.message || "Email updated successfully");
      setUser({ ...user, email: response.data.email });
      setNewEmail("");
      setEmailPassword("");
    } catch (err) {
      setEmailError(err.response?.data?.message || "Error updating email");
    }
  };

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError("");

    try {
      await api.delete("/api/auth/delete-account", {
        data: { currentPassword: deletePassword },
      });
      localStorage.removeItem("authToken");
      setUser({});
      navigate("/");
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Error deleting account");
    }
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      {user?.username && <p>Logged in as {user.username}</p>}

      <h3>Change Password</h3>
      <form onSubmit={handleChangePassword}>
        <div className="field">
          <label htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="confirmNewPassword">Confirm new password</label>
          <input
            id="confirmNewPassword"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>

        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        {passwordMessage && <p style={{ color: "green" }}>{passwordMessage}</p>}

        <button type="submit">Update Password</button>
      </form>

      <h3>Change Email</h3>
      <form onSubmit={handleChangeEmail}>
        <div className="field">
          <label htmlFor="newEmail">New email</label>
          <input
            id="newEmail"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="emailPassword">Current password</label>
          <input
            id="emailPassword"
            type="password"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            required
          />
        </div>

        {emailError && <p style={{ color: "red" }}>{emailError}</p>}
        {emailMessage && <p style={{ color: "green" }}>{emailMessage}</p>}

        <button type="submit">Update Email</button>
      </form>
<h3>Delete Account</h3>
      {!showDeleteConfirm ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          style={{ background: "darkred", color: "white" }}
        >
          Delete My Account
        </button>
      ) : (
        <form onSubmit={handleDeleteAccount}>
          <p style={{ color: "red" }}>
            This is permanent and cannot be undone. Enter your password to confirm.
          </p>
          <div className="field">
            <label htmlFor="deletePassword">Current password</label>
            <input
              id="deletePassword"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              required
            />
          </div>

          {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}

          <button type="submit" style={{ background: "darkred", color: "white" }}>
            Confirm Delete
          </button>
          <button
            type="button"
            onClick={() => {
              setShowDeleteConfirm(false);
              setDeletePassword("");
              setDeleteError("");
            }}
          >
            Cancel
          </button>
        </form>
      )}

    </div>
  );
}