# 🩸 BloodConnect

**BloodConnect** is a full-stack web application built with the **MERN stack** that bridges the gap between **blood donors** and **recipients**. It provides a real-time platform to post and respond to urgent blood requests based on **location** and **blood group**, helping save lives through fast and efficient communication.

---

##  Features

- 🔍 **Live Blood Requests**  
  Blood requests are broadcast in real time to eligible donors using **WebSockets**, sorted by proximity.

- 🧭 **Donor Filtering by Location & Group**  
  Smart filtering system displays the most relevant and nearest requests to each donor.

- 📲 **SMS Alerts**  
  When a donor accepts a request, an automated **SMS** is sent to the requester (via **Twilio**) for confirmation.

- 🖼️ **Profile Picture Uploads**  
  Users can upload and manage profile pictures, securely stored in **AWS S3**.

- 👤 **User Profile Management**  
  Personalized dashboard with user details and blood donation history (optional).

- 🌐 **Fully Deployed on AWS EC2**  
  Both **frontend and backend** are hosted on EC2 with a custom domain, NGINX, and secure environment configs.

---

## 🧑‍💻 Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | React.js, Axios, Tailwind CSS  |
| Backend      | Node.js, Express.js, Socket.IO |
| Database     | MongoDB (Cloud - MongoDB Atlas)|
| Deployment   | AWS EC2, NGINX, PM2            |
| Image Storage| AWS S3                         |
| Realtime     | WebSockets (Socket.IO)         |
| Notifications| Twilio (SMS API)               |

---



