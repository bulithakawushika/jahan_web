# Jahan Web – Case Study Project

🌐 **Live Deployment:** [https://jahan-ai.bulitha.online](https://jahan-ai.bulitha.online)  

📂 **GitHub Repository:** [https://github.com/bulithakawushika/jahan_web](https://github.com/bulithakawushika/jahan_web)  

---

## Functionality

- Fully functional features as per assessment requirements.

### User Preferences
Users can control each personal detail separately:

- What personal details are visible to others.
- Whole account visibility.
- Notifications sent to others regarding personal data modifications.
- Notifications received by the user.

### Preference Categories
- **Account Settings:** Manage username, email, and password.  
- **Notification Settings:** Control email and push notifications.  
- **Theme Settings:** Customize colors, fonts, and layout.  
- **Privacy Settings:** Manage profile visibility and data sharing.  
- **Accessibility:** High contrast, brightness adjustments, keyboard navigation, screen reader compatibility, adherence to accessibility standards.  

---

## Backend

- Built with **Django** and **PostgreSQL** (SQLite3 for testing).  
- Implements secure authentication and best practices.  

---

## Frontend

- Developed with **responsive design principles** using **Webix Framework**.  
- **Testing:** Jest framework for frontend.  

---

## CI/CD

- Configured with **GitHub Actions** to run frontend and backend tests on push and pull events to the main branch.  

---

## Deployment & Security

- Hosted on an **AWS EC2 instance**.  
- Integrated with **Cloudflare** for proxy, DNS hardening, and security adjustments.  
- **ModSecurity WAF** enabled for enhanced protection.  
- **GitHub Security:** Dependabot, secret management, and CodeQL enabled.  

---

## Testing Accounts

Use the following test accounts to verify notifications functionality when modifying personal details:

| Username | Password  |
|----------|-----------|
| test1    | test12345 |
| test2    | test12345 |

---

## Notes

- All functions are fully tested with **unit and functional tests**.
- CI/CD ensures **continuous testing** for both frontend and backend.  
- The project adheres to **accessibility standards**, allowing usability for users with disabilities.  
- **Responsive Design:** Works on desktop, tablet, and mobile devices.  
- **Validation & Error Handling:** Robust mechanisms to maintain data integrity and provide meaningful error messages.  
