document
  .getElementById("fileInput")
  .addEventListener("change", handleFileUpload);
document
  .getElementById("downloadButton")
  .addEventListener("click", downloadUpdatedJSON);

let jsonData = {};

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type === "application/json") {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        jsonData = JSON.parse(e.target.result);
        displayJSON(jsonData);
      } catch (error) {
        alert("please upload a valid JSON file");
      }
    };
    reader.readAsText(file);
  } else {
    alert("please upload a valid JSON file");
  }
}

function displayJSON(
  data,
  container = document.getElementById("jsonContainer")
) {
  container.innerHTML = "";
  displayNestedObject(data, container);
  container.classList.remove("hidden");
  document.getElementById("downloadButton").classList.remove("hidden");
}

function displayNestedObject(data, container) {
  Object.keys(data).forEach((key) => {
    const value = data[key];
    const row = document.createElement("div");
    row.className = "mb-2";

    const keyLabel = document.createElement("span");
    keyLabel.className = "block font-medium text-gray-600 mb-1";
    keyLabel.textContent = key;

    row.appendChild(keyLabel);

    if (typeof value === "object" && value !== null) {
      // İç içe geçmiş nesneler için yeni bir container oluştur
      const nestedContainer = document.createElement("div");
      nestedContainer.className = "ml-4 border-l-2 pl-4 border-gray-300";
      displayNestedObject(value, nestedContainer); // Recursive çağrı
      row.appendChild(nestedContainer);
    } else {
      const inputField = document.createElement("input");
      inputField.type = "text";
      inputField.className = "w-full p-2 border border-gray-300 rounded";
      inputField.value = value;
      inputField.addEventListener("input", (e) => {
        data[key] = e.target.value;
        inputField.classList.add("bg-yellow-100"); // Add class to highlight changed fields
      });
      row.appendChild(inputField);
    }

    container.appendChild(row);
  });
}

function downloadUpdatedJSON() {
  const jsonString = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "updated_translations.json";
  link.click();
  URL.revokeObjectURL(url);
}
