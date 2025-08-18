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

##screenshots 

🔑 Login Page

<img width="1895" height="899" alt="Screenshot 2025-08-16 185748" src="https://github.com/user-attachments/assets/ee683c4a-5111-4a9b-852d-7cf925359d32" />
