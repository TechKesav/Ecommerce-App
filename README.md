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

### 1️⃣ Clone the repository
```bash
git clone https://github.com/TechKesav/Ecommerce-App.git
cd Ecommerce-App
2️⃣ Backend Setup (Spring Boot)
cd backend
./mvnw spring-boot:run

```
Runs at: http://localhost:8080
```bash
3️⃣ Frontend Setup (React)
cd frontend
npm install
npm start


Runs at: http://localhost:3000
```
```bash
4️⃣ Database Setup (Docker + MySQL + phpMyAdmin)
docker pull mysql
docker pull phpmyadmin/phpmyadmin

Run MySQL container:

docker run --name ecommerce-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=ecommerce -p 3306:3306 -d mysql

Run phpMyAdmin:

docker run --name ecommerce-phpmyadmin -d --link ecommerce-mysql:db -p 8081:80 phpmyadmin/phpmyadmin

phpMyAdmin runs at: http://localhost:8085

## 📊 Screenshots

🔑 Login Page and Register page

<img width="1895" height="899" alt="Screenshot 2025-08-16 185748" src="https://github.com/user-attachments/assets/54088f3f-8302-4ce6-83b3-d200ee6c21c6" />
<img width="1894" height="909" alt="Screenshot 2025-08-16 185822" src="https://github.com/user-attachments/assets/a7cf6cd0-cf23-41ca-a69b-db8419ac481a" />

➕ Adding a Product and 🛒 Cart Features

<img width="859" height="441" alt="Screenshot 2025-08-16 185627" src="https://github.com/user-attachments/assets/fa0e5345-39cf-479d-8912-75bd69be3a90" />

🛒 Product Listing with Filters

<img width="1919" height="909" alt="Screenshot 2025-08-16 185532" src="https://github.com/user-attachments/assets/2bac1efe-590a-4433-b5b1-19dd23f456d5" />

📈 Admin Analytics Dashboard

<img width="1898" height="909" alt="Screenshot 2025-08-18 183312" src="https://github.com/user-attachments/assets/33eeca59-d57b-45a7-b8a5-fb86449867b9" />

💳 Razorpay Payment Screen

<img width="1870" height="846" alt="Screenshot 2025-08-16 190051" src="https://github.com/user-attachments/assets/73628236-9e92-4ab0-9021-1068c01e6dd4" />

💳 Payment Status

<img width="1900" height="892" alt="Screenshot 2025-08-16 185649" src="https://github.com/user-attachments/assets/36d3457f-3830-492f-8c26-5073718d4bec" />

JWT Authentication for secure user sessions

Spring Security for role-based access (User/Admin)

Bucket4j rate limiting → prevents brute-force attacks

✅ Future Enhancements

Wishlist feature

Order tracking system

Email notifications

Deployment on AWS/GCP
```
## 👨‍💻 Author

## Kesavan M
📌 Aspiring software developer || Tech enthusiast || Passionate about building scalable, secure, and efficient software systems || Always eager to learn
