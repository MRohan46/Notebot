# 🤖 NoteBot: The AI-Powered Student OS

## ✨ AI-Powered Study Suite for the Modern Student

**NoteBot** is a full-cycle academic tool designed to eliminate study friction. It transforms raw, dense lecture material into actionable study resources (summaries, quizzes) and includes an integrated, ephemeral chat platform for zero-friction collaboration. Built by students, for students.

---

## 🚀 Features

NoteBot combines two core applications into one cohesive suite:

### 1. NoteBot: AI Learning Engine
* **Intelligent Summaries:** Instantly converts pasted text or uploaded files into proportional, bulleted summaries. The length adjusts automatically based on the input size.
* **Custom Quiz Generation:** Generates practice questions (quizzes) directly from your content to facilitate active recall and test comprehension.
* **Personal Knowledge Vault:** Users can log in and save all generated summaries and quizzes to a secure Library for later review and spaced repetition.

### 2. Quick Connect: Ephemeral Chat 💬
* **No-Login Collaboration:** Create instant, temporary chat rooms via a simple shareable link, without needing to sign up or log in.
* **Session-Based:** Rooms are designed for short-term study groups or project teams and can be set to expire, minimizing digital clutter.
* **Contextual Linking (Innovation):** Users can share a read-only link of a saved NoteBot session directly into the Quick Connect chat, creating a rich preview for instant, content-specific discussion.

---

## 💡 Impact & Innovation

| Criteria | NoteBot Solution |
| :--- | :--- |
| **Impact** | Solves the dual problem of **information overload** (via AI summaries) and **collaboration friction** (via no-login chat), making it an all-in-one productivity hub. |
| **Innovation** | **AI-powered Quiz Generation** and the concept of a **session-based, expiring chat** (Quick Connect) differentiate it from standard persistent communication tools. |
| **Design** | Features a visually striking **"Neo-Academic" dark mode** with high-contrast cyan and violet accents, providing a futuristic, focus-enhancing interface. |

---

## 🎨 Design & Tech Stack

### Frontend & Design
The design uses a **Deep Space Black** and **Midnight Slate** palette with **Electric Cyan** and **Neo Violet** accents, creating a modern, high-contrast, and low-eye-strain environment.

### Backend & Technology
| Component | Technology | Role |
| :--- | :--- | :--- |
| **AI Processing** | **Gemini 2.5 Flash API** | Summary and Custom Quiz generation logic. |
| **Frontend** | React / Vue / Svelte (e.g., using a tool like Claude AI) | Modular, component-based UI construction. |
| **Backend/DB** | Node.js (Express) & MongoDB/Firebase | User authentication, library persistence, and real-time chat data management. |
| **Real-time Chat** | Socket.io / Firebase Realtime DB | Powers the instantaneous messaging in Quick Connect. |

---

## 🛠️ Setup and Installation

Follow these steps to get a local copy of NoteBot running.

### Prerequisites

* Node.js (v18 or higher)
* A Gemini API Key (for the AI features)
* A Database URL (MongoDB/Firebase)

### Local Setup

1.  **Clone the Repository:**
    ```bash
    git clone [YOUR-REPO-LINK]
    cd notebot
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # Or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your keys:
    ```
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    DATABASE_URL="YOUR_DB_CONNECTION_STRING"
    # Additional keys for chat/auth...
    ```

4.  **Run the Application:**
    ```bash
    npm start
    # The app will be available at http://localhost:3000
    ```

---

## 🧑‍💻 Team

| Name | Role | GitHub |
| :--- | :--- | :--- |
| [Muhammad Rohan] | Full-Stack Developer, Design Lead | [@MRohan46] |
