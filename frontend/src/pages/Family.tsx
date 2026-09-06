import { useEffect, useState } from "react";
import { getFamilyMembers } from "../services/api";

function Family() {

  const [family, setFamily] =
    useState<any[]>([]);

  useEffect(() => {

    getFamilyMembers()
      .then((data) => setFamily(data));

  }, []);

  return (
    <div className="page-container">

      <h1>👨‍👩‍👧 My Family</h1>

      <div className="family-list">

        {family.map((member) => (

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

          </div>

        ))}

      </div>

    </div>
  );
}

export default Family;