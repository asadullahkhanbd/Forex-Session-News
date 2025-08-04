
// Timezone conversion & session info logic
const sessions = [
  {
    name: "London",
    start: 8,
    end: 17,
    pairs: ["EUR/USD", "GBP/USD", "EUR/GBP", "USD/CHF"]
  },
  {
    name: "New York",
    start: 13,
    end: 22,
    pairs: ["USD/CAD", "USD/JPY", "EUR/USD", "GBP/USD"]
  },
  {
    name: "Tokyo",
    start: 0,
    end: 9,
    pairs: ["USD/JPY", "EUR/JPY", "GBP/JPY"]
  },
  {
    name: "Sydney",
    start: 22,
    end: 7,
    pairs: ["AUD/USD", "AUD/JPY", "NZD/USD"]
  }
];

function getCurrentSession() {
  const now = new Date();
  const utcHour = now.getUTCHours();
  // Check each session if current UTC hour is within start-end
  for (const session of sessions) {
    if (session.start < session.end) {
      if (utcHour >= session.start && utcHour < session.end) {
        return session;
      }
    } else {
      // Overnight session (e.g., Sydney)
      if (utcHour >= session.start || utcHour < session.end) {
        return session;
      }
    }
  }
  return null;
}

function displaySession() {
  const sessionInfo = document.getElementById("session-info");
  const pairsList = document.getElementById("pairs-list");
  const session = getCurrentSession();

  if (session) {
    sessionInfo.textContent = `${session.name} session is currently OPEN.`;
    pairsList.innerHTML = "";
    session.pairs.forEach(pair => {
      const li = document.createElement("li");
      li.textContent = pair;
      pairsList.appendChild(li);
    });
  } else {
    sessionInfo.textContent = "No active session right now.";
    pairsList.innerHTML = "";
  }
}

// Dummy news data with high impact marking
const newsData = [
  { time: "14:30", currency: "USD", event: "Non-Farm Payroll", impact: "high" },
  { time: "16:00", currency: "EUR", event: "ECB Interest Rate Decision", impact: "high" },
  { time: "18:00", currency: "GBP", event: "BOE Inflation Report", impact: "medium" }
];

function displayNews() {
  const newsList = document.getElementById("news-list");
  newsList.innerHTML = "";

  newsData.forEach(news => {
    const div = document.createElement("div");
    div.textContent = `${news.time} ${news.currency} - ${news.event}`;
    if (news.impact === "high") {
      div.classList.add("high-impact");
    }
    newsList.appendChild(div);
  });
}

window.onload = function() {
  displaySession();
  displayNews();
  // Refresh session info every minute
  setInterval(displaySession, 60000);
};
