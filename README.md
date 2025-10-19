# 🚨 MumbaiHacks: AI Emergency Load Balancer for Urban Hospital Networks

An **intelligent agent** designed to optimize patient routing during **mass casualty incidents** in a city like **Mumbai**. This AI system predicts hospital strain and dynamically generates optimized dispatch plans — ensuring patients reach the *fastest available care*, not just the *closest hospital*.

Developed for the **MumbaiHacks Hackathon** 🧠💡


---

## 🌆 The Problem: Urban Overload During Emergencies

During a large-scale emergency, the default approach of sending all patients to the nearest hospital creates a **critical bottleneck**:

- The closest facility becomes **overwhelmed**, leading to long wait times.  
- Nearby hospitals remain **underutilized**.  
- The result: delayed critical care and **avoidable fatalities**.

Urban healthcare networks lack real-time, city-wide coordination — that’s where our **AI Emergency Load Balancer** comes in.


---

## 🤖 Our Solution: An Agentic AI Coordinator

The system functions as an **autonomous emergency coordinator** following a **Sense–Think–Act** cycle:

### 🧠 SENSE  
Monitors real-time data from hospitals, including:
- Bed occupancy  
- Staff availability  
- Specialty care units (e.g., trauma, burn, cardiac)

### 🤔 THINK  
Predicts and plans using AI:
- **XGBoost model** forecasts future ER wait times.  
- An **optimization algorithm** computes a “Time-to-Treatment” score — balancing travel time with predicted waiting time.

### 🚑 ACT  
Executes dynamic routing and load balancing:
- Suggests ambulance dispatch routes.  
- Notifies hospitals in advance.  
- Allocates resources to prevent system bottlenecks before they form.


---

## 🛠️ Tech Stack

### **Backend**
- **Framework:** Python (Flask)  
- **Machine Learning:** Scikit-learn, Pandas, NumPy, XGBoost  
- **Core Logic:** Standard Python libraries (subprocess, json)

### **Frontend**
- **Framework:** React.js  
- **Build Tool:** Vite  
- **API Client:** Axios  
- **Styling:** CSS

---

## 🔗 Project Link

🌐 **Live Demo:** https://mumbai-hacks-five.vercel.app

---

## 👥 Team & Acknowledgments

Developed by the **Data Dabbawalas Team-Karan Tulsani,Ved Dange,Dhananjay Yadav,Nimish Tilwani** 
Special thanks to the hackathon organizers and mentors for guidance and support.

---

> ⚙️ *AI that saves lives — optimizing emergency response, one decision at a time.*