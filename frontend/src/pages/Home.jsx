import React, { useEffect, useState } from "react";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    fetch("/list.json")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    let data = [...properties];

    // Location search
    if (search.trim() !== "") {
      data = data.filter((item) =>
        item.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      data = data.filter((item) => item.type === typeFilter);
    }

    // Budget filter
    switch (priceFilter) {
      case "below25":
        data = data.filter((item) => item.price < 2500000);
        break;
      case "25to50":
        data = data.filter((item) => item.price >= 2500000 && item.price < 5000000);
        break;
      case "50to1cr":
        data = data.filter((item) => item.price >= 5000000 && item.price < 10000000);
        break;
      case "1to2cr":
        data = data.filter((item) => item.price >= 10000000 && item.price < 20000000);
        break;
      case "above2cr":
        data = data.filter((item) => item.price >= 20000000);
        break;
      default:
        break;
    }

    setFiltered(data);
  }, [search, typeFilter, priceFilter, properties]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Find Your Dream Property 🏠</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search by location..."
          className="input input-bordered w-full md:max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered w-full md:max-w-xs"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
          <option value="commercial">Commercial</option>
        </select>

        <select
          className="select select-bordered w-full md:max-w-xs"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="all">All Budgets</option>
          <option value="below25">Below ₹25 Lakhs</option>
          <option value="25to50">₹25L - ₹50 Lakhs</option>
          <option value="50to1cr">₹50L - ₹1 Crore</option>
          <option value="1to2cr">₹1 Cr - ₹2 Cr</option>
          <option value="above2cr">Above ₹2 Cr</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((property) => (
            <div key={property.id} className="card bg-white shadow-xl rounded-lg">
              <figure>
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-xl">{property.title}</h2>
                <p className="text-sm text-gray-600">{property.location}</p>
                <p className="text-green-700 font-semibold text-lg">
                  ₹ {property.price}
                </p>
                <div className="card-actions justify-end">
                  <div className="badge badge-outline">{property.type}</div>
                  <button className="btn btn-primary btn-sm">View Details</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full text-gray-500">No matching properties found.</div>
        )}
      </div>
    </div>
  );
};

export default Home;
