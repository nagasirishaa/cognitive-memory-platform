import { useEffect, useState } from "react";

import {
  getFamilyMembers,
  addFamilyMember,
} from "../services/api";

function Family() {
  const [family, setFamily] = useState<any[]>(
    []
  );

  const [name, setName] = useState("");
  const [relationship, setRelationship] =
    useState("");
  const [age, setAge] = useState("");

  const [adding, setAdding] = useState(false);

  const storedUser =
    localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const patientId = user?.patientId;

  async function loadFamily() {
    if (!patientId) {
      return;
    }

    try {
      const data =
        await getFamilyMembers(patientId);

      setFamily(data);
    } catch (error) {
      console.error(
        "Failed to load family members:",
        error
      );
    }
  }

  useEffect(() => {
    loadFamily();
  }, [patientId]);

  async function handleAddFamilyMember() {
    if (!name || !relationship) {
      alert(
        "Please enter the name and relationship."
      );
      return;
    }

    if (!patientId) {
      alert(
        "Patient information was not found. Please login again."
      );
      return;
    }

    try {
      setAdding(true);

      const data = await addFamilyMember({
        patientId,
        name,
        relationship,
        age: age
          ? Number(age)
          : undefined,
      });

      if (!data.success) {
        alert(
          data.message ||
            "Failed to add family member."
        );
        return;
      }

      alert(
        "Family member added successfully!"
      );

      setName("");
      setRelationship("");
      setAge("");

      await loadFamily();
    } catch (error) {
      console.error(
        "Failed to add family member:",
        error
      );

      alert(
        "Unable to add family member. Please make sure the backend is running."
      );
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="page-container">
      <h1>👨‍👩‍👧 My Family</h1>

      {/* Add Family Member */}
      <div className="family-card">
        <h2>➕ Add Family Member</h2>

        <label>Name</label>

        <input
          type="text"
          placeholder="Enter family member name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <label>
          Relationship
        </label>

        <input
          type="text"
          placeholder="e.g. Daughter, Son, Wife"
          value={relationship}
          onChange={(e) =>
            setRelationship(
              e.target.value
            )
          }
        />

        <label>Age</label>

        <input
          type="number"
          placeholder="Enter age (optional)"
          value={age}
          onChange={(e) =>
            setAge(e.target.value)
          }
        />

        <button
          onClick={
            handleAddFamilyMember
          }
          disabled={adding}
          style={{
            marginTop: "15px",
            padding: "10px 16px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          {adding
            ? "Adding..."
            : "Add Family Member"}
        </button>
      </div>

      {/* Family List */}
      <div className="family-list">
        {family.length > 0 ? (
          family.map((member) => (
            <div
              className="family-card"
              key={member.id}
            >
              <div className="family-avatar">
                👤
              </div>

              <h2>
                {member.name}
              </h2>

              <p>
                {member.relation}
              </p>

              {member.age && (
                <p>
                  Age: {member.age}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="family-card">
            <p>
              No family members added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Family;