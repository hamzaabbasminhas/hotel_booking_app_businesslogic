import React from 'react';
import { useState } from "react";
import "./App.css";

const GUESTS = [23, 45, 155, 374, 22, 99, 100, 101, 115, 209];

function calculateOccupancy(premiumRooms: number, economyRooms: number) {
  const sortedGuests = [...GUESTS].sort((a, b) => b - a);
  let premiumOccupancy = 0, economyOccupancy = 0;
  let premiumRevenue = 0, economyRevenue = 0;

  let unallocatedGuests: number[] = [];

  // Allocate Premium Rooms
  for (const guest of sortedGuests) {
    if (guest >= 100 && premiumRooms > 0) {
      premiumOccupancy++;
      premiumRevenue += guest;
      premiumRooms--;
    } else if (guest < 100) {
      unallocatedGuests.push(guest);
    }
  }

  //allocate premium rooms to highest economy guest on availability
  unallocatedGuests = unallocatedGuests.reverse();
  if(premiumRooms > 0 && unallocatedGuests.length >= economyRooms )
  {
    for (let i = unallocatedGuests.length - 1; i >= 0; i--) {
      if (premiumRooms > 0) {
          const guest = unallocatedGuests[i];
          premiumOccupancy++;
          premiumRevenue += guest;
          premiumRooms--;
          unallocatedGuests.splice(i, 1);
      }
    }
  }
  // Allocate Economy Rooms
  for (let i = unallocatedGuests.length - 1; i >= 0; i--) {
    if (economyRooms > 0) {
        const guest = unallocatedGuests[i];
        economyOccupancy++;
        economyRevenue += guest;
        economyRooms--;
        unallocatedGuests.splice(i, 1);
    }
  }

return {
  premiumOccupancy,
  economyOccupancy,
  premiumRevenue,
  economyRevenue,
};
}
function App() {
  const [premiumRooms, setPremiumRooms] = useState(0);
  const [economyRooms, setEconomyRooms] = useState(0);
  const [occupancy, setOccupancy] = useState<any>(null);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const result = calculateOccupancy(premiumRooms, economyRooms);
    setOccupancy(result);
  };

  return (
    <div className="root">
      <div className="main">
        <form onSubmit={handleSubmit}>
          <div>
            <p>Premium Rooms:</p>
            <input
              type="number"
              value={premiumRooms}
              onChange={(event) =>
                setPremiumRooms(parseInt(event.target.value, 10))
              }
            />
          </div>
          <br />
          <div>
            <p>Economy Rooms:</p>
            <input
              type="number"
              value={economyRooms}
              onChange={(event) =>
                setEconomyRooms(parseInt(event.target.value, 10))
              }
            />
          </div>
          <br />
          <button type="submit">Calculate Occupancy</button>
        </form>
        {occupancy && (
          <div>
            <p>
              Free Premium rooms: {premiumRooms - occupancy.premiumOccupancy}
            </p>
            <p>
              Free Economy rooms: {economyRooms - occupancy.economyOccupancy}
            </p>
            <p>
              Usage Premium: {occupancy.premiumOccupancy} (EUR{" "}
              {occupancy.premiumRevenue})
            </p>
            <p>
              Usage Economy: {occupancy.economyOccupancy} (EUR{" "}
              {occupancy.economyRevenue})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
