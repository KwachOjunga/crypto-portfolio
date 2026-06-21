# 🪙 Simple Crypto Portfolio Tracker

A lightweight, client-side JavaScript application to track your cryptocurrency holdings. This project features a clean dashboard interface that calculates real-time asset values, manages your current portfolio distribution, and visualizes data using a responsive pie chart.

---

## ✨ Features

* **Asset Management**: Easily add new coin holdings with name, current price, and quantity owned.
* **Live Calculations**: Instantly calculates the total value per asset ($Price \times Quantity$) and updates the portfolio's grand total.
* **Visual Dashboard**: Displays a visual breakdown of your asset distribution using an interactive pie chart.
* **Quick Delete**: Remove assets instantly from your dashboard with automatic total and chart recalculations.
* **Persistent Storage**: Uses browser local storage to keep your portfolio data safe even after a page refresh.

---

## 🛠️ Tech Stack

* **Frontend Structure**: HTML5
* **Styling**: Tailwind CSS
* **Logic**: Vanilla JavaScript
* **Data Visualization**: Chart.js


##  Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
Bun or node

### Installation

1. Clone this repository to your local machine:
   ```sh
   git clone https://github.com
   ```

2. Navigate into the project directory:
   ```sh
   cd simple-crypto-portfolio
   ```

3. Use `npm` , `bun`, `deno` or whichever equivalent to do:
    ```sh
     bun i && bun run dev 
    ```

## Data Structure

Each asset in the portfolio is managed as a JavaScript object adhering to the following structure:

```json
{
  "id": "1710923847521",
  "coinName": "Ethereum",
  "currentPrice": 3500.50,
  "amountOwned": 1.5
}
```

