# CDR Call Analytics Dashboard

## 1. Project Overview

The CDR (Call Detail Records) Call Analytics Dashboard is a web application designed to analyse and visualise telephone call records.

The application retrieves call data from an external REST API and presents key information through KPI cards, interactive charts and a recent call logs table.

It provides an overview of call volumes, durations, costs, activity patterns and geographical distribution.

## 2. Dashboard Features

### Key Performance Indicators (KPIs)

- **Total Calls:** Total number of recorded calls.
- **Total Call Cost:** Combined cost of all calls.
- **Average Call Duration:** Average call duration in seconds.
- **Successful Calls:** Number of successful calls.
- **Failed Calls:** Number of unsuccessful calls.

### Call Duration Analytics

- Shortest call duration.
- Average call duration.
- Longest call duration.
- Bar chart comparing call durations.

### Call Activity Timeline

- Displays call activity throughout the day.
- Groups calls by hour using call start times.
- Interactive line chart showing call volumes.

### Calls by City

- Groups calls by geographical location.
- Displays the number of calls for each city.
- Horizontal bar chart comparing call volumes.

### Call Cost Analytics

- Calculates average cost per call.
- Calculates total call costs by city.
- Interactive bar chart visualising costs.

### Recent Call Logs

Displays the ten most recent call records:

- Caller Name
- Caller Number
- Receiver Number
- City
- Duration
- Cost
- Start Time

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| JavaScript (ES6+) | Application logic and data processing |
| React | User interface and components |
| Vite | Development and build tool |
| Tailwind CSS | Styling and responsive layouts |
| shadcn/ui | UI components |
| Base UI | Accessible component primitives |
| Recharts | Data visualisation and charts |
| Lucide React | Icons |
| REST API (MockAPI) | Retrieving call records |
| HTML5 | Application structure |
| CSS3 | Styling |
| npm | Package management |
| Git | Version control |
| GitHub | Source code repository |
| Vercel | Hosting and deployment |

## 4. API

The dashboard retrieves call records from the following API:

`https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr`

The API provides caller information, call direction, call status, duration, cost, city and timestamps.

## 5. Project Links

**Live Application:**

https://lsa-call-analytics-flame.vercel.app/

**GitHub Repository:**

https://github.com/Alek20s/LSA-call-analytics

**Hosting Platform:**

Vercel

## 6. Deployment

The application is deployed on Vercel and connected to the GitHub repository.