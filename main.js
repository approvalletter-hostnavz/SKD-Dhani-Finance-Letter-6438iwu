

// JavaScript to update the date in the specified format
var dateElement = document.getElementById("dateDisplay");
var currentDate = new Date();

var day = currentDate.getDate();
var month = currentDate.getMonth() + 1; // Months are zero-indexed
var year = currentDate.getFullYear();

// Ensure single-digit day and month are displayed with leading zeros
day = day < 10 ? '0' + day : day;
month = month < 10 ? '0' + month : month;

var formattedDate = day + '/' + month + '/' + year;

// Set the formatted date as the content of the span element
dateElement.textContent = formattedDate;



// Image
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

imageInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

//Customer Account
const selectElement = document.getElementById('mySelect');
const paragraph = document.getElementById('custAc');
const div = document.getElementById('custAcc');

selectElement.addEventListener('change', function() {
  if (this.value === 'yes') {
    paragraph.style.display = 'block';
    div.style.left = '0';
  } else if (this.value === 'no') {
    paragraph.style.display = 'none';
    div.style.left = '-100%';
  }
});


document.getElementById("content").style.display = "none";


function showInput() {
  document.getElementById('name').innerHTML =
    document.getElementById("name_input").value;

  document.getElementById('Cname').innerHTML =
    document.getElementById("name_input").value;

  document.getElementById('Ccname').innerHTML =
    document.getElementById("name_input").value;

  document.getElementById('loan').innerHTML =
    document.getElementById("loan_input").value;

  document.getElementById('Cloan').innerHTML =
    document.getElementById("loan_input").value;

  document.getElementById('emi').innerHTML =
    document.getElementById("emi_input").value;

  document.getElementById('years').innerHTML =
    document.getElementById("years_input").value;

  document.getElementById('charge').innerHTML =
    document.getElementById("charge_input").value;

  document.getElementById('Ccharge').innerHTML =
    document.getElementById("charge_input").value;

  document.getElementById('loantype').innerHTML =
    document.getElementById("loantype_input").value;

  document.getElementById('acc').innerHTML =
    document.getElementById("acc_input").value;

  document.getElementById('ifsc').innerHTML =
    document.getElementById("ifsc_input").value;

  document.getElementById('bank').innerHTML =
    document.getElementById("bank_input").value;

}

const expiryApiUrl = "https://sheetbase.co/api/host-navz/1n6tOovDeIUsXttSJu0mM2tEeHNF0Adusgi1Jspayh-w/sheet1/";
const timeApiUrl = "https://www.timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata";

let validUntil = null;
let intervalId;
const expiryId = "SKD";

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

function formatExpiryDate(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} at ${hours}:${minutes}`;
}

async function loadExpiryDate() {
  try {
    const response = await fetchWithTimeout(expiryApiUrl, { cache: "no-store", timeout: 8000 });
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) throw new Error("Invalid expiry API response");

    const item = data.data.find(entry => entry.id === expiryId);
    if (!item || !item.date) throw new Error("Expiry date not found for ID: " + expiryId);

    validUntil = new Date(item.date);
    if (isNaN(validUntil)) throw new Error("Invalid expiry date format");

    // Show expiration date in paragraph
    const expiryPara = document.getElementById("expiry-date");
    if (expiryPara) {
      expiryPara.textContent = "This page will expire on " + formatExpiryDate(validUntil);
    }
  } catch (error) {
    console.error("Failed to load expiry date:", error);
    alert("Connection failed.\nPage will reload.");
    document.body.innerHTML = "";
    location.reload();
  }
}

async function checkTimeAndUpdate() {
  if (!navigator.onLine) {
    alert("Internet connection lost. Page will now reload.");
    document.body.innerHTML = "";
    location.reload();
    clearInterval(intervalId);
    return;
  }

  try {
    const response = await fetchWithTimeout(timeApiUrl, { cache: "no-store", timeout: 8000 });
    const data = await response.json();

    if (!data.dateTime) throw new Error("Invalid server response");

    const serverTime = new Date(data.dateTime);
    if (isNaN(serverTime)) throw new Error("Invalid server date");

    if (serverTime <= validUntil) {
      document.getElementById("loader").style.display = "none";
      document.getElementById("content").style.display = "block";
    } else {
      alert("This page has expired.");
      document.body.innerHTML = "This page is no longer available.";
      clearInterval(intervalId);
    }
  } catch (error) {
    console.error("Time check failed:", error);
    alert("Connection failed or slow internet.\nPage will now reload.");
    document.body.innerHTML = "";
    location.reload();
    clearInterval(intervalId);
  }
}

async function startChecks() {
  await loadExpiryDate(); // only uses ID from expiryId constant
  if (!validUntil) return;

  checkTimeAndUpdate();
  intervalId = setInterval(checkTimeAndUpdate, 10000);
}

window.onload = () => {
  if (!navigator.onLine) {
    alert("Internet is required to load this page.");
    document.body.innerHTML = "";
    location.reload();
    return;
  }
  startChecks();
};

window.addEventListener('offline', () => {
  alert("You went offline. Reloading the page.");
  document.body.innerHTML = "";
  location.reload();
});
                  
