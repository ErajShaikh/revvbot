\# revvbot
 

Professional Discord review management bot built for communities, businesses, gaming servers, service providers, and marketplaces.
 

revvbot provides a clean and structured review system with star ratings, review IDs, rating analytics, anti-spam protection, and mod-specific reviews.
 

\---
 

\# ✨ Features
 

\- ⭐ Star-based review system
 
\- 🆔 Unique review ID tracking
 
\- 📊 Accurate overall rating calculation
 
\- 🔽 Mod dropdown autocomplete system
 
\- 🛡 One review per user
 
\- ⚙ Easy setup with slash commands
 
\- 🎨 Clean and professional embeds
 
\- 🌍 Multi-server support
 

\---
 

\# 📦 Commands
 

\## \`/setchannel\`
 

Sets the channel where reviews will be posted.
 

\### Permissions
 
Administrator only
 

\### Usage
 
\`\`\`txt
 
/setchannel channel:#reviews
 

/addmodname
 
Adds a mod/product/service name that users can review.
 
Permissions
 
Administrator only
 
Usage
 
Plain text
 

/addmodname name:Premium Service
 
What it does
 
Adds a review category
 
Appears in review dropdown
 
Users can select it while reviewing
 

/review
 
Submit a review for a selected mod/service/product.
 
Usage
 
Plain text
 

/review
 
Options
 
Option
 
Description
 
mod
 
Select mod/service from dropdown
 
star
 
Rating from 1-5
 
review
 
Written feedback
 
What it does
 
Sends professional review embed
 
Stores review permanently
 
Generates unique review ID
 
Prevents duplicate reviews
 

/rating
 
Shows the server's average review rating.
 
Usage
 
Plain text
 

/rating
 
What it does
 
Calculates average star rating
 
Shows total review count
 
Supports decimal ratings
 
Example:
 
Plain text
 
⭐ Overall Rating: 4.7/5 (53 reviews)
 

🚀 Setup Guide
 
1\. Install Dependencies
 
Bash
 
npm install
 

2\. Configure Environment Variables
 
Create environment variables:
 
Variable
 
Description
 
TOKEN
 
Your Discord bot token
 
CLIENT\_ID
 
Your Discord application ID
 

3\. Start the Bot
 
Bash
 
npm start
 

📁 Project Structure
 
Plain text
 
index.js
 
data.json
 
package.json
 
README.md
 

🛠 Requirements
 
Node.js v18 or higher
 
discord.js v14
 

🔒 Security Warning
 
Never share your:
 
Bot Token
 
Client Secret
 
API Keys
 
If exposed, regenerate them immediately from the Discord Developer Portal.
 

📜 License
 
MIT License
 

🌟 revvbot
 
Clean. Structured. Reliable.