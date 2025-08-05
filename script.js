const sessions = [
  { name: "London", start: 8, end: 17, pairs: ["EUR/USD", "GBP/USD", "EUR/GBP", "USD/CHF"] },
  { name: "New York", start: 13, end: 22, pairs: ["USD/CAD", "USD/JPY", "EUR/USD", "GBP/USD"] },
  { name: "Tokyo", start: 0, end: 9, pairs: ["USD/JPY", "EUR/JPY", "GBP/JPY"] },
  { name: "Sydney", start: 22, end: 7, pairs: ["AUD/USD", "AUD/JPY", "NZD/USD"] }
];

// 🕒 Show Local Time
function updateLocalTime() {
  const localTimeSpan = document.getElementById("local-time");
  setInterval(() => {
    const now = new Date();
    localTimeSpan.textContent = now.toLocaleString();
  }, 1000);
}

// 🔍 Find Current Session
function getCurrentSession() {
  const now = new Date();
  const utcHour = now.getUTCHours();
  for (const session of sessions) {
    if (session.start < session.end) {
      if (utcHour >= session.start && utcHour < session.end) return session;
    } else {
      if (utcHour >= session.start || utcHour < session.end) return session;
    }
  }
  return null;
}

// 🕘 Format Session Time in Local Time
function formatTimeInLocal(hourUTC) {
  const now = new Date();
  now.setUTCHours(hourUTC, 0, 0, 0);
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ✅ Show Current Session Info
function displaySession() {
  const sessionInfo = document.getElementById("session-info");
  const sessionTime = document.getElementById("session-time");
  const pairsList = document.getElementById("pairs-list");
  const session = getCurrentSession();

  if (session) {
    sessionInfo.textContent = `${session.name} session is currently OPEN.`;

    const startLocal = formatTimeInLocal(session.start);
    const endLocal = formatTimeInLocal(session.end);
    sessionTime.textContent = `Open Time: ${startLocal} — Close Time: ${endLocal}`;

    pairsList.innerHTML = "";
    session.pairs.forEach(pair => {
      const li = document.createElement("li");
      li.textContent = pair;
      pairsList.appendChild(li);
    });
  } else {
    sessionInfo.textContent = "No active session right now.";
    sessionTime.textContent = "";
    pairsList.innerHTML = "";
  }
}

// ⏭️ Get Next Session & Countdown
function getNextSession() {
  const nowUTC = new Date();
  const utcHour = nowUTC.getUTCHours();
  const utcMinute = nowUTC.getUTCMinutes();
  const totalMinutesNow = utcHour * 60 + utcMinute;

  let nextSession = null;
  let minDiff = Infinity;

  sessions.forEach(session => {
    const sessionStart = session.start * 60;
    let diff;

    if (sessionStart > totalMinutesNow) {
      diff = sessionStart - totalMinutesNow;
    } else {
      diff = (24 * 60 - totalMinutesNow) + sessionStart;
    }

    if (diff < minDiff) {
      minDiff = diff;
      nextSession = session;
    }
  });

  return { session: nextSession, minutesToStart: minDiff };
}

function formatCountdown(minutesLeft) {
  const hours = Math.floor(minutesLeft / 60);
  const minutes = Math.floor(minutesLeft % 60);
  const seconds = 60 - new Date().getUTCSeconds();
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

function displayNextSession() {
  const nextInfo = document.getElementById("next-session-info");
  const nextTimer = document.getElementById("next-session-timer");

  const updateTimer = () => {
    const { session, minutesToStart } = getNextSession();
    nextInfo.textContent = `Next session: ${session.name}`;
    nextTimer.textContent = `Starts in: ${formatCountdown(minutesToStart)}`;
  };

  updateTimer();
  setInterval(updateTimer, 1000); // countdown update
}

// 🚀 On Page Load
window.onload = function () {
  updateLocalTime();
  displaySession();
  displayNextSession();
  setInterval(displaySession, 60000); // recheck current session every minute
};
