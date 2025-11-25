import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  useEffect(() => {
    // MOCKED PRODUCTS
    const mockProducts = [
      {
        id: 1,
        name: "Fresh Milk",
        price: 2.5,
        image:
          "https://images.unsplash.com/photo-1582719478175-57b3c6f9c2d6?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: 2,
        name: "Tomatoes",
        price: 1.2,
        image:
          "https://images.unsplash.com/photo-1582515073490-3998134b7f1d?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: 3,
        name: "Carrots",
        price: 1.5,
        image:
          "https://images.unsplash.com/photo-1592928305523-5c38dbf91c6f?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: 4,
        name: "Spinach",
        price: 0.9,
        image:
          "https://images.unsplash.com/photo-1582515073490-3998134b7f1d?auto=format&fit=crop&w=400&q=80",
      },
    ];

    setProducts(mockProducts);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🥛 DailyBasket</h2>
        <p style={styles.user}>Hello, {user?.name || user?.email}</p>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={styles.main}>
        <h2 style={styles.heading}>Fresh Products from Our Farmers</h2>

        <div style={styles.productGrid}>
          {products.map((p) => (
            <div key={p.id} style={styles.productCard}>
              <img src={p.image} alt={p.name} style={styles.productImage} />
              <h4 style={styles.productName}>{p.name}</h4>
              <p style={styles.productPrice}>${p.price}</p>
            </div>
          ))}
        </div>

        <div style={styles.farmerSection}>
          <img
            src="https://images.unsplash.com/photo-1586201375761-83865001e7df?auto=format&fit=crop&w=800&q=80"
            alt="Farmer"
            style={styles.farmerImage}
          />
          <p style={styles.farmerText}>
            Supporting local farmers by delivering fresh produce to your
            doorstep.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    fontFamily: "'Poppins', sans-serif",
    minHeight: "100vh",
    background: "#f6f7f9",
  },
  sidebar: {
    width: 250,
    background: "#4CAF50",
    color: "#fff",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  user: {
    marginBottom: 40,
    textAlign: "center",
    fontSize: 16,
  },
  logoutBtn: {
    padding: 12,
    width: "100%",
    background: "#FF3B30",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    marginTop: "auto",
  },
  main: {
    flex: 1,
    padding: 30,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    color: "#333",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 20,
    marginBottom: 30,
  },
  productCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 15,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "0.3s",
    cursor: "pointer",
  },
  productImage: {
    width: "100%",
    height: 120,
    objectFit: "cover",
    borderRadius: 12,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  farmerSection: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  farmerImage: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
  },
  farmerText: {
    fontSize: 16,
    color: "#333",
  },
};
