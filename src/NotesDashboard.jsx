import { useEffect, useState } from "react";
import { useAuth } from "./App";

export default function NotesDashboard() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user info from token
  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      setUser(null);
    }
  }, [token]);

  // Fetch notes
  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          "https://notes-backend-xs1f.onrender.com/api/notes/showNotes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch notes");
        setNotes(data.notes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [token]);

  // Add or edit note
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        const res = await fetch(
          `https://notes-backend-xs1f.onrender.com/api/notes/editNote/${editing.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update note");
        setNotes((notes) =>
          notes.map((n) => (n._id === editing._id ? data.note : n))
        );
        setEditing(null);
      } else {
        const res = await fetch(
          "https://notes-backend-xs1f.onrender.com/api/notes/addNote",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to add note");
        setNotes((notes) => [data.note, ...notes]);
      }
      setForm({ title: "", description: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(
        `https://notes-backend-xs1f.onrender.com/api/notes/deleteNote/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete note");
      setNotes((notes) => notes.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Start editing
  const startEdit = (note) => {
    setEditing(note);
    setForm({ title: note.title, description: note.description });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditing(null);
    setForm({ title: "", description: "" });
  };

  return (
    <div className="app-container dashboard-futuristic">
      {user && (
        <div className="dashboard-greeting">
          Welcome, <b>{user.fullname || user.username || user.email}</b>!
        </div>
      )}
      <div className="card dashboard-addnote-card">
        <h2 className="dashboard-section-title">
          {editing ? "Edit Note" : "Add Note"}
        </h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="title">Title</label>
          <input
            name="title"
            id="title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={3}
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" className="futuristic-btn">
              {editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button
                type="button"
                className="futuristic-btn cancel"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && (
          <div
            style={{ color: "crimson", marginTop: "1rem", textAlign: "center" }}
          >
            {error}
          </div>
        )}
      </div>
      <div className="dashboard-notes-list">
        <h3 className="dashboard-section-title" style={{ marginBottom: 18 }}>
          Your Notes
        </h3>
        <div style={{ width: "100%", maxWidth: 600 }}>
          {loading ? (
            <div style={{ textAlign: "center" }}>Loading notes...</div>
          ) : notes.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888" }}>
              No notes yet.
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="card note-card-futuristic"
                style={{ marginBottom: "1.2rem", position: "relative" }}
              >
                <h3 style={{ margin: 0 }}>{note.title}</h3>
                <p style={{ margin: "0.7rem 0 0.5rem 0", color: "#444" }}>
                  {note.description}
                </p>
                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}
                >
                  <button
                    className="futuristic-btn edit"
                    onClick={() => startEdit(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="futuristic-btn delete"
                    onClick={() => handleDelete(note._id)}
                  >
                    Delete
                  </button>
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 18,
                    fontSize: "0.8rem",
                    color: "#bbb",
                  }}
                >
                  {new Date(note.updatedAt || note.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
