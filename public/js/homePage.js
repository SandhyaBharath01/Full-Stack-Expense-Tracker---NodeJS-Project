const categoryItems = document.querySelectorAll(".dropdown-item");
const categoryInput = document.querySelector("#categoryInput");
const categoryBtn = document.querySelector("#categoryBtn");
const form = document.getElementById("form1");
const addExpenseBtn = document.getElementById("submitBtn");
const table = document.getElementById("tbodyId");
const buyPremiumBtn = document.getElementById("buyPremiumBtn");
const reportsLink = document.getElementById("reportsLink");
const leaderboardLink = document.getElementById("leaderboardLink");
const logoutBtn = document.getElementById("logoutBtn");

categoryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const selectedCategory = e.target.getAttribute("data-value");
    categoryBtn.textContent = e.target.textContent;
    categoryInput.value = selectedCategory;
  });
});



async function addExpense() {
  try {
    const category = document.getElementById("categoryBtn");
    const description = document.getElementById("descriptionValue");
    const amount = document.getElementById("amountValue");
    const categoryValue = category.textContent.trim();
    const descriptionValue = description.value.trim();
    const amountValue = amount.value.trim();

    if (categoryValue == "Select Category") {
      alert("Select the Category!");
      window.location.href = "/homePage";
      return;
    }
    if (!descriptionValue) {
      alert("Add the Description!");
      window.location.href = "/homePage";
      return;
    }
    if (!Number(amountValue)) {
      alert("Please enter a valid amount!");
      window.location.href = "/homePage";
      return;
    }


    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // add leading zeros to day and month if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // create the date string in date-month-year format
    const dateStr = `${formattedDay}-${formattedMonth}-${year}`;

    // console.log(dateStr); // outputs something like "23-02-2023"

    const token = localStorage.getItem("token");
    const res = await axios
      .post(
        "http://localhost:2222/expense/addExpense",
        {
          date: dateStr,
          category: categoryValue,
          description: descriptionValue,
          amount: Number(amountValue),
        },
        { headers: { Authorization: token } }
      )
      .then((res) => {
        if (res.status == 200) {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch {
    console.error("AddExpense went wrong");
  }
}

async function getAllExpenses() {
  // e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:2222/expense/getAllExpenses/1",
      { headers: { Authorization: token } }
    );
    
    res.data.expenses.slice(0,expensesPerPage).forEach((expenses) => {
      const id = expenses.id;
      const date = expenses.date;
      const categoryValue = expenses.category;
      const descriptionValue = expenses.description;
      const amountValue = expenses.amount;

      let tr = document.createElement("tr");
      tr.className = "trStyle";

      table.appendChild(tr);

      let idValue = document.createElement("th");
      idValue.setAttribute("scope", "row");
      idValue.setAttribute("style", "display: none");

      let th = document.createElement("th");
      th.setAttribute("scope", "row");

      tr.appendChild(idValue);
      tr.appendChild(th);

      idValue.appendChild(document.createTextNode(id));
      th.appendChild(document.createTextNode(date));

      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(categoryValue));

      let td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(descriptionValue));

      let td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(amountValue));

      let td4 = document.createElement("td");

      let deleteBtn = document.createElement("button");
      deleteBtn.className = "editDelete btn btn-danger delete";
      deleteBtn.appendChild(document.createTextNode("Delete"));

      let editBtn = document.createElement("button");
      editBtn.className = "editDelete btn btn-success edit";
      editBtn.appendChild(document.createTextNode("Edit"));

      td4.appendChild(deleteBtn);
      td4.appendChild(editBtn);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
    });
    const expensesPerPageInput = document.getElementById("expensesPerPage");
  const expensesPerPage = Number(expensesPerPageInput.value);

  expensesPerPageInput.addEventListener("change", () => {
    localStorage.setItem("expensesPerPage", expensesPerPageInput.value);
    updateExpensesPerPage();
  });

  function updateExpensesPerPage() {
    const savedExpensesPerPage = localStorage.getItem("expensesPerPage");
    if (savedExpensesPerPage) {
      expensesPerPageInput.value = savedExpensesPerPage;
    }
  }

  updateExpensesPerPage();

    // ---------------------------------------------------------------------//

    const ul = document.getElementById("paginationUL");
    for (let i = 1; i <= res.data.totalPages; i++) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      li.setAttribute("class", "page-item");
      a.setAttribute("class", "page-link");
      a.setAttribute("href", "#");
      a.appendChild(document.createTextNode(i));
      li.appendChild(a);
      ul.appendChild(li);
      a.addEventListener("click", paginationBtn);
    }
  } catch {
    (err) => console.log(err);
  }
}
async function paginationBtn(e) {
  try {
    const pageNo = e.target.textContent;
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:2222/expense/getAllExpenses/${pageNo}`,
      { headers: { Authorization: token } }
    );

    table.innerHTML = "";
    const expensesPerPageInput = document.getElementById("expensesPerPage");
  const expensesPerPage = parseInt(expensesPerPageInput.value);

  const startIndex = (pageNo - 1) * expensesPerPage;
  const endIndex = pageNo * expensesPerPage;

  res.data.expenses.slice(startIndex, endIndex).forEach((expenses) => {
      const id = expenses.id;
      const date = expenses.date;
      const categoryValue = expenses.category;
      const descriptionValue = expenses.description;
      const amountValue = expenses.amount;

      let tr = document.createElement("tr");
      tr.className = "trStyle";

      table.appendChild(tr);

      let idValue = document.createElement("th");
      idValue.setAttribute("scope", "row");
      idValue.setAttribute("style", "display: none");

      let th = document.createElement("th");
      th.setAttribute("scope", "row");

      tr.appendChild(idValue);
      tr.appendChild(th);

      idValue.appendChild(document.createTextNode(id));
      th.appendChild(document.createTextNode(date));

      let td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(categoryValue));

      let td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(descriptionValue));

      let td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(amountValue));

      let td4 = document.createElement("td");

      let deleteBtn = document.createElement("button");
      deleteBtn.className = "editDelete btn btn-danger delete";
      deleteBtn.appendChild(document.createTextNode("Delete"));

      let editBtn = document.createElement("button");
      editBtn.className = "editDelete btn btn-success edit";
      editBtn.appendChild(document.createTextNode("Edit"));

      td4.appendChild(deleteBtn);
      td4.appendChild(editBtn);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteExpense(e) {
  try {
    const token = localStorage.getItem("token");
    if (e.target.classList.contains("delete")) {
      let tr = e.target.parentElement.parentElement;
      let id = tr.children[0].textContent;
      const res = await axios.get(
        `http://localhost:2222/expense/deleteExpense/${id}`,
        { headers: { Authorization: token } }
      );
      window.location.reload();
    }
  } catch {
    (err) => console.log(err);
  }
}

async function editExpense(e) {
  try {
    const token = localStorage.getItem("token");
    const categoryValue = document.getElementById("categoryBtn");
    const descriptionValue = document.getElementById("descriptionValue");
    const amountValue = document.getElementById("amountValue");
    const addExpenseBtn = document.getElementById("submitBtn");
    if (e.target.classList.contains("edit")) {
      let tr = e.target.parentElement.parentElement;
      let id = tr.children[0].textContent;
      //Fill the input values with the existing values
      const res = await axios.get(
        "http://localhost:2222/expense/getAllExpenses",
        { headers: { Authorization: token } }
      );
      res.data.forEach((expense) => {
        if (expense.id == id) {
          categoryValue.textContent = expense.category;
          descriptionValue.value = expense.description;
          amountValue.value = expense.amount;
          addExpenseBtn.textContent = "Update";

          // const form = document.getElementById("form1");
          addExpenseBtn.removeEventListener("click", addExpense);

          addExpenseBtn.addEventListener("click", async function update(e) {
            e.preventDefault();
            console.log("request to backend for edit");
            const res = await axios.post(
              `http://localhost:2222/expense/editExpense/${id}`,
              {
                category: categoryValue.textContent.trim(),
                description: descriptionValue.value,
                amount: amountValue.value,
              },
              { headers: { Authorization: token } }
            );
            window.location.reload();
          });
        }
      });
    }
  } catch {
    (err) => console.log(err);
  }
}

async function buyPremium(e) {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "http://localhost:2222/purchase/premiumMembership",
    { headers: { Authorization: token } }
  );
  var options = {
    key: res.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: res.data.order.id, // For one time payment
    // This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:2222/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      console.log(res);
      alert(
        "Welcome to our Premium Membership, You have now access to Reports and LeaderBoard"
      );
      window.location.reload();
      localStorage.setItem("token", res.data.token);
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
}

async function isPremiumUser() {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:2222/user/isPremiumUser", {
    headers: { Authorization: token },
  });
  if (res.data.isPremiumUser === true) {
    buyPremiumBtn.innerHTML = "Premium Member &#x25C6";
    reportsLink.removeAttribute("onclick");
    leaderboardLink.removeAttribute("onclick");
    leaderboardLink.setAttribute("href", "/premium/getLeaderboardPage");
    reportsLink.setAttribute("href", "/reports/getReportsPage");
    buyPremiumBtn.removeEventListener("click", buyPremium);
  } else {
  }
}

function download() {
  const button = document.createElement("button")
  button.textContent = "download"
  button.classList.add("download")
  leaderboard.appendChild(button)
  button.addEventListener('click', () => {
      //preventDefault()
      const token = localStorage.getItem("token")
      axios.get('http://localhost:2222/user/download', { headers: { Autherization: token } })
          .then((response) => {
              console.log(response, "this is download resposne")
              if (response.status === 201) {
                  //the bcakend is essentially sending a download link
                  //  which if we open in browser, the file would download

                  var a = document.createElement("a");
                  a.href = response.data.url;
                  a.download = 'myexpense.csv';
                  a.click();
                  console.log(response.data.url)
                  showFileHistory()
              } else {
                  throw new Error(response.data.message)
              }
          })
          .catch((err) => {
              console.log(err)
          });
  })
}

async function showFileHistory() {
  try {
      const token = localStorage.getItem("token")
      const allFiles = await axios.get("http://localhost:2222/premium/getfilehistory",
          { headers: { Autherization: token } })
      console.log(allFiles.data.files)
      if (allFiles) {
          document.getElementById("file-history").style.display = "block";
          allFiles.data.files.forEach(file => {
              const li = document.createElement("li")
              li.innerHTML = `<a href=${file.fileUrl}>${file.fileName}</a>`
              document.getElementById("file-history-ul").appendChild(li)
          })
      } else {
          const item = document.createElement(li)
          li.textContent = ("no file download history")
          document.getElementById("file-history-ul").appendChild(item)
      }
  } catch (err) {
      console.log(err)
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

buyPremiumBtn.addEventListener("click", buyPremium);
addExpenseBtn.addEventListener("click", addExpense);
document.addEventListener("DOMContentLoaded", isPremiumUser);
document.addEventListener("DOMContentLoaded", getAllExpenses);
document.addEventListener("DOMContentLoaded", download);
document.addEventListener("DOMContentLoaded", showFileHistory);

table.addEventListener("click", (e) => {
  deleteExpense(e);
});
table.addEventListener("click", (e) => {
  editExpense(e);
});

window.onload = getAllExpenses;
logoutBtn.addEventListener("click", logout);
