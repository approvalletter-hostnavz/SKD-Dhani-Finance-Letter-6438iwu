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


const validUntil = new Date("2025-09-01T16:51:00+05:30"); // Set your expiry date/time
    const apiUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLimUoOBgdUqJAVJV_fLnRY05BYZzEs6oK065zafGOBJ64mmwRb9X0wpfZvX7dBXHx16BfrjzEgSHJlkJdeZpfBFzXfLyVVnCQfWyHchgPhU9KzF7aN2Ixlta7F8DbZtC5Ft4Zhu8q336-3hRGil0GoJBowqSO0WHudlqj0F70jFQXdNJvYp0iUPzZ11f92UeL8JmVEfNeKUJdn4BpQb9CbYX1Umpz2O4BM3UJHSR1X-tkPx-xJ3-3UILYrGR0BLnEKORS4-T5Xj95k6ugF6OP3m25LejA&lib=MwxUjRcLr2qLlnVOLh12wSNkqcO1Ikdrk";

    let intervalId;

    async function fetchWithTimeout(resource, options = {}) {
      const { timeout = 8000 } = options; // 8 seconds max
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

    async function checkTimeAndUpdate() {
      if (!navigator.onLine) {
        alert("Internet connection lost. Page will now reload.");
        document.body.innerHTML = "";
        location.reload();
        clearInterval(intervalId);
        return;
      }

      try {
        const response = await fetchWithTimeout(apiUrl, { cache: "no-store", timeout: 8000 });
        const data = await response.json();

        if (data.status !== "ok" || !data.fulldate) throw new Error("Invalid server response");

        const serverTime = new Date(data.fulldate);
        if (isNaN(serverTime)) throw new Error("Invalid date");

        if (serverTime <= validUntil) {
          document.getElementById("loader").style.display = "none";
          document.getElementById("content").style.display = "block";
        } else {
          alert("This page has expired.");
          document.body.innerHTML = "";
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Time check failed:", error);
        alert("Connection failed or slow internet.\nPage will now reload.");
        document.body.innerHTML = "";
        location.reload(); // retry after delay
        clearInterval(intervalId);
      }
    }

    function startChecks() {
      checkTimeAndUpdate(); // First time
      intervalId = setInterval(checkTimeAndUpdate, 10000); // Repeat every 10 sec
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

    // If user goes offline at any point
    window.addEventListener('offline', () => {
      alert("You went offline. Reloading the page.");
      document.body.innerHTML = "";
      location.reload();
    });
