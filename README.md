# 🛒 E-Commerce App

An end-to-end **E-commerce web application** built with **React (frontend)**, **Spring Boot (backend)**, and **MySQL (database running in Docker)**.  
The application includes **secure authentication**, **admin dashboard for product management & analytics**, **shopping cart functionality**, **Razorpay integration**, and **rate limiting for login security**.

🔗 **Clone Repository:** [Ecommerce-App](https://github.com/TechKesav/Ecommerce-App.git)

---

## 🚀 Tech Stack

### 🔹 Frontend
- React.js
- Axios (API integration)
- Tailwind / CSS (UI Styling)

### 🔹 Backend
- Spring Boot
- Spring Security with **JWT Authentication**
- Bucket4j (Rate Limiting)
- Razorpay Payment Gateway Integration

### 🔹 Database & DevOps
- MySQL (**Docker container**)
- phpMyAdmin (Database management)

---

## ✨ Features

### 👤 User Features
- Register & Login with **JWT-based authentication**
- **Rate Limiting**: More than 5 failed login attempts blocks login for **30 seconds**
- Update profile details
- Browse all products
- Filter & Sort products by **price (Low → High / High → Low)**
- Add products to cart
- Remove products from cart
- Checkout with **Razorpay (Test Mode)**

### 🛠️ Admin Features
- Add new products
- View all products with analytics (product count & sales insights)
- Manage users

---

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/TechKesav/Ecommerce-App.git
cd Ecommerce-App
```

### 2️⃣ Backend Setup (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
Runs at: `http://localhost:8080`

### 3️⃣ Frontend Setup (React)
```bash
cd frontend
npm install
npm start
```
Runs at: `http://localhost:3000`

### 4️⃣ Database Setup (Docker + MySQL + phpMyAdmin)

Pull Docker images:
```bash
docker pull mysql
docker pull phpmyadmin/phpmyadmin
```

Run MySQL container:
```bash
docker run --name ecommerce-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=ecommerce -p 3306:3306 -d mysql
```

Run phpMyAdmin:
```bash
docker run --name ecommerce-phpmyadmin -d --link ecommerce-mysql:db -p 8081:80 phpmyadmin/phpmyadmin
```

phpMyAdmin runs at: `http://localhost:8085`

---

## 🔐 Security Highlights

- **JWT Authentication** for secure user sessions
- **Spring Security** for role-based access (User/Admin)
- **Bucket4j rate limiting** → prevents brute-force attacks

---

## ⚡ Redis Caching Strategy

### How It Works

#### On Product Retrieval (GET):
- Check if products exist in Redis cache
- If cached data found → Return immediately (ultra-fast response) ⚡
- If cache miss → Query database, store in Redis, return to user
- Cache TTL (Time To Live): Configurable based on requirements

#### On Product Modification (POST/PUT/DELETE):
- Perform database operation
- Invalidate Redis cache automatically
- Refresh cache with updated data
- Ensures data consistency across layers

### Benefits

| Benefit | Impact |
|---------|--------|
| **Reduced Database Load** | Fewer queries to MySQL, lower CPU/Memory usage |
| **Faster Response Times** | In-memory retrieval vs disk-based database queries |
| **Improved Scalability** | Handle more concurrent users without bottlenecks |
| **Better User Experience** | Quicker product page loads |
| **Cost Optimization** | Reduced database resource consumption |

### Cache Invalidation Events

The following admin operations trigger cache updates:
- **Add Product** → Cache updated with new product list
- **Update Product** → Cache invalidated and refreshed
- **Delete Product** → Cache invalidated and refreshed

---

## 📸 Screenshots

### 🔑 Login Page & Register Page
![Login Page](https://github.com/user-attachments/assets/ee683c4a-5111-4a9b-852d-7cf925359d32)
![Register Page](https://github.com/user-attachments/assets/0a821c83-26c0-487c-a97b-de13c56ff763)

### ➕ Adding a Product & 🛒 Cart
![Add Product](https://github.com/user-attachments/assets/c51f249d-0834-45f7-bfa1-ebb9a57b9357)
![Cart](https://github.com/user-attachments/assets/5799b42f-40b3-4e65-a35e-ea930a57cfd4)

### 🛒 Product Listing with Filters
![Product Listing](https://github.com/user-attachments/assets/137b631d-125c-47b7-88bc-cf925bfcf479)

### 📈 Admin Analytics Dashboard
![Analytics Dashboard](https://github.com/user-attachments/assets/f1f8b3fa-d6b1-4efc-b4a8-86ed0e19c414)

### 💳 Payment Status
![Payment Status](https://github.com/user-attachments/assets/a545351b-55e5-490f-bc4f-868fc897a41f)

### 💳 Razorpay Payment Screen
![Razorpay Payment](https://github.com/user-attachments/assets/a645a9df-fceb-494a-bd81-94fd515b91db)

---

## ✅ Future Enhancements

- Wishlist feature
- Order tracking system
- Email notifications
- Deployment on AWS/GCP

---

## 👨‍💻 Author

**Kesavan M**

📌 Aspiring software developer || Tech enthusiast || Passionate about building scalable, secure, and efficient software systems || Always eager to learn
