const dateInput = document.getElementById("date");
const dateShowBtn = document.getElementById("dateShowBtn");
const tbodyDaily = document.getElementById("tbodyDailyId");
const tfootDaily = document.getElementById("tfootDailyId");

const monthInput = document.getElementById("month");
const monthShowBtn = document.getElementById("monthShowBtn");
const tbodyMonthly = document.getElementById("tbodyMonthlyId");
const tfootMonthly = document.getElementById("tfootMonthlyId");
const downloadReportBtn = document.getElementById("downloadReport");

const token = localStorage.getItem("token");


const logoutBtn = document.getElementById("logoutBtn");

async function getDailyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const date = new Date(dateInput.value);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;

    let totalAmount = 0;
    const res = await axios.post(
      "http://localhost:2222/reports/dailyReports",
      {
        date: formattedDate,
      },
      { headers: { Authorization: token } }
    );

    tbodyDaily.innerHTML = "";
    tfootDaily.innerHTML = "";

    res.data.forEach((expense) => {
      totalAmount += expense.amount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyDaily.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootDaily.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "dailyTotal");
    td4.setAttribute("id", "dailyTotalAmount");
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log(error);
  }
}

async function getMonthlyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const month = new Date(monthInput.value);
    const formattedMonth = `${(month.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    let totalAmount = 0;
    const res = await axios.post(
      "http://localhost:2222/reports/monthlyReports",
      {
        month: formattedMonth,
      },
      { headers: { Authorization: token } }
    );

    tbodyMonthly.innerHTML = "";
    tfootMonthly.innerHTML = "";

    res.data.forEach((expense) => {
      totalAmount += expense.amount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyMonthly.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootMonthly.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "monthlyTotal");
    td4.setAttribute("id", "monthlyTotalAmount");
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log(error);
  }
}

// document.querySelectorAll('#year').forEach(year => {
//   year.innerHTML = new Date().getFullYear()
// })
// document.querySelector('#month').innerHTML =getMonthName( new Date().getMonth()+1);

// document.querySelector('#download').onclick = downloadReport ;

// handler();
async function handler() {

  const isPremium = await axios.get(`${url}/user/ispremium`, config)
  if(!isPremium.data.isPremium){
      document.querySelector('#download').disabled = true
  }


  const report = await axios.get(`${url}/expenses/user/report`, config)
  
  yearExpenses = report.data

  yearExpenses.forEach((monthExpense, index) => {
          const tr = document.createElement('tr')
          tr.innerHTML = `
          <td>${getMonthName(index+1)}</td>
          <td>${monthExpense.monthTotalExpense}</td>`
          document.querySelector('#yearlyreport').appendChild(tr)
  });

  yearExpenses.forEach((expenses, index) => {
      if(index == new Date().getMonth()){
          const currentMonthExpense = expenses.expenses
          currentMonthExpense.forEach((expense, i) => {
              const tr = document.createElement('tr')
              tr.innerHTML = `
              <th>${i+1}</th>
              <td>${expense.descriptionValue}</td>
              <td>${expense.categoryMenu}</td>
              <td>${expense.amount}</td>
              `
              document.querySelector('#monthlyreport').appendChild(tr)
          })
          
      }
  })
}


downloadReportBtn.addEventListener("click", async () => {
  try {
    const response = await axios.get("http://localhost:2222/user/getFileHistory", {
      headers: { Authorization: token },
    });

    if (response.status === 200 && response.data.files.length > 0) {
      const fileUrl = response.data.files[0].fileurl; // Assuming only one file is returned
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = "report.csv"; // Set the desired filename for the downloaded file
      a.click();
    } else {
      alert("No files available for download.");
    }
  } catch (error) {
    console.log(error);
    alert("Failed to download the report.");
  }
});


async function showDownloadedFiles() {
  try {
    const res = await axios.get("http://localhost:2222/user/getTableData", {
      headers: { Authorization: token },
    });

    res.data.forEach((file, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${file.createdAt.slice(0, 10)}</td>
        <td>
          <div class="button" id=${file.fileurl}>
            <button class="btn btn-dark btn-sm" type="submit" id="oldfiledownload">Download</button>
          </div>
        </td>
      `;
      document.querySelector("#downloadedfiles").appendChild(tr);
    });
  } catch (error) {
    console.log(error);
    alert("Error retrieving downloaded files. Please try again later.");
  }
}


document.querySelector('#downloadedfiles').onclick = async(e) => {
    if(e.target.id == 'oldfiledownload'){
        const fileUrl = e.target.parentNode.id
        var a = document.createElement('a');
        a.href = fileUrl;
        a.download = "temp.csv"
        a.click()
    } 
}

async function logout() {
  try {
    localStorage.clear();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

dateShowBtn.addEventListener("click", getDailyReport);
monthShowBtn.addEventListener("click", getMonthlyReport);
logoutBtn.addEventListener("click", logout);

document.addEventListener('DOMContentLoaded', function() {
  var downloadButton = document.getElementById('downloadReport');
  if (downloadButton) {
    downloadButton.addEventListener('click', function() {
      // Handle the download button click event here
    });
  }
});

downloadReportBtn.addEventListener("click", downloadReport);

