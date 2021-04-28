/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/assets/js/db.js":
/*!********************************!*\
  !*** ./public/assets/js/db.js ***!
  \********************************/
/***/ ((module) => {

eval("var db;\nvar budgetVersion; // Create a new db request for a \"budget\" database.\n\nvar request = indexedDB.open('BudgetDB', budgetVersion || 21);\n\nrequest.onupgradeneeded = function (e) {\n  console.log('Upgrade needed in IndexDB');\n  var oldVersion = e.oldVersion;\n  var newVersion = e.newVersion || db.version;\n  console.log(\"DB Updated from version \".concat(oldVersion, \" to \").concat(newVersion));\n  db = e.target.result;\n\n  if (db.objectStoreNames.length === 0) {\n    db.createObjectStore('BudgetStore', {\n      autoIncrement: true\n    });\n  }\n};\n\nrequest.onerror = function (e) {\n  console.log(\"Woops! \".concat(e.target.errorCode));\n};\n\nfunction checkDatabase() {\n  console.log('check db invoked'); // Open a transaction on your BudgetStore db\n\n  var transaction = db.transaction(['BudgetStore'], 'readwrite'); // access your BudgetStore object\n\n  var store = transaction.objectStore('BudgetStore'); // Get all records from store and set to a variable\n\n  var getAll = store.getAll(); // If the request was successful\n\n  getAll.onsuccess = function () {\n    // If there are items in the store, we need to bulk add them when we are back online\n    if (getAll.result.length > 0) {\n      fetch('/api/transaction/bulk', {\n        method: 'POST',\n        body: JSON.stringify(getAll.result),\n        headers: {\n          Accept: 'application/json, text/plain, */*',\n          'Content-Type': 'application/json'\n        }\n      }).then(function (response) {\n        return response.json();\n      }).then(function (res) {\n        // If our returned response is not empty\n        if (res.length !== 0) {\n          // Open another transaction to BudgetStore with the ability to read and write\n          transaction = db.transaction(['BudgetStore'], 'readwrite'); // Assign the current store to a variable\n\n          var currentStore = transaction.objectStore('BudgetStore'); // Clear existing entries because our bulk add was successful\n\n          currentStore.clear();\n          console.log('Clearing store 🧹');\n        }\n      });\n    }\n  };\n}\n\nrequest.onsuccess = function (e) {\n  console.log('success');\n  db = e.target.result; // Check if app is online before reading from db\n\n  if (navigator.onLine) {\n    console.log('Backend online! 🗄️');\n    checkDatabase();\n  }\n};\n\nvar saveRecord = function saveRecord(record) {\n  console.log('Save record invoked'); // Create a transaction on the BudgetStore db with readwrite access\n\n  var transaction = db.transaction(['BudgetStore'], 'readwrite'); // Access your BudgetStore object store\n\n  var store = transaction.objectStore('BudgetStore'); // Add record to your store with add method.\n\n  store.add(record);\n}; // Listen for app coming back online\n\n\nwindow.addEventListener('online', checkDatabase);\nmodule.exports = {\n  saveRecord: saveRecord\n};\n\n//# sourceURL=webpack://budget-app/./public/assets/js/db.js?");

/***/ }),

/***/ "./public/assets/js/index.js":
/*!***********************************!*\
  !*** ./public/assets/js/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db */ \"./public/assets/js/db.js\");\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_db__WEBPACK_IMPORTED_MODULE_0__);\n\nvar transactions = [];\nvar myChart;\nfetch(\"/api/transaction\").then(function (response) {\n  return response.json();\n}).then(function (data) {\n  // save db data on global variable\n  transactions = data;\n  populateTotal();\n  populateTable();\n  populateChart();\n});\n\nfunction populateTotal() {\n  // reduce transaction amounts to a single total value\n  var total = transactions.reduce(function (total, t) {\n    return total + parseInt(t.value);\n  }, 0);\n  var totalEl = document.querySelector(\"#total\");\n  totalEl.textContent = total;\n}\n\nfunction populateTable() {\n  var tbody = document.querySelector(\"#tbody\");\n  tbody.innerHTML = \"\";\n  transactions.forEach(function (transaction) {\n    // create and populate a table row\n    var tr = document.createElement(\"tr\");\n    tr.innerHTML = \"\\n      <td>\".concat(transaction.name, \"</td>\\n      <td>\").concat(transaction.value, \"</td>\\n    \");\n    tbody.appendChild(tr);\n  });\n}\n\nfunction populateChart() {\n  // copy array and reverse it\n  var reversed = transactions.slice().reverse();\n  var sum = 0; // create date labels for chart\n\n  var labels = reversed.map(function (t) {\n    var date = new Date(t.date);\n    return \"\".concat(date.getMonth() + 1, \"/\").concat(date.getDate(), \"/\").concat(date.getFullYear());\n  }); // create incremental values for chart\n\n  var data = reversed.map(function (t) {\n    sum += parseInt(t.value);\n    return sum;\n  }); // remove old chart if it exists\n\n  if (myChart) {\n    myChart.destroy();\n  }\n\n  var ctx = document.getElementById(\"myChart\").getContext(\"2d\");\n  myChart = new Chart(ctx, {\n    type: 'line',\n    data: {\n      labels: labels,\n      datasets: [{\n        label: \"Total Over Time\",\n        fill: true,\n        backgroundColor: \"#6666ff\",\n        data: data\n      }]\n    }\n  });\n}\n\nfunction sendTransaction(isAdding) {\n  var nameEl = document.querySelector(\"#t-name\");\n  var amountEl = document.querySelector(\"#t-amount\");\n  var errorEl = document.querySelector(\".form .error\"); // validate form\n\n  if (nameEl.value === \"\" || amountEl.value === \"\") {\n    errorEl.textContent = \"Missing Information\";\n    return;\n  } else {\n    errorEl.textContent = \"\";\n  } // create record\n\n\n  var transaction = {\n    name: nameEl.value,\n    value: amountEl.value,\n    date: new Date().toISOString()\n  }; // if subtracting funds, convert amount to negative number\n\n  if (!isAdding) {\n    transaction.value *= -1;\n  } // add to beginning of current array of data\n\n\n  transactions.unshift(transaction); // re-run logic to populate ui with new record\n\n  populateChart();\n  populateTable();\n  populateTotal(); // also send to server\n\n  fetch(\"/api/transaction\", {\n    method: \"POST\",\n    body: JSON.stringify(transaction),\n    headers: {\n      Accept: \"application/json, text/plain, */*\",\n      \"Content-Type\": \"application/json\"\n    }\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    if (data.errors) {\n      errorEl.textContent = \"Missing Information\";\n    } else {\n      // clear form\n      nameEl.value = \"\";\n      amountEl.value = \"\";\n    }\n  })[\"catch\"](function (err) {\n    console.log(\"calling saveRecord!!!\"); // fetch failed, so save in indexed db\n\n    _db__WEBPACK_IMPORTED_MODULE_0___default().saveRecord(transaction); // clear form\n\n    nameEl.value = \"\";\n    amountEl.value = \"\";\n  });\n}\n\ndocument.querySelector(\"#add-btn\").onclick = function () {\n  sendTransaction(true);\n};\n\ndocument.querySelector(\"#sub-btn\").onclick = function () {\n  sendTransaction(false);\n};\n\n//# sourceURL=webpack://budget-app/./public/assets/js/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./public/assets/js/db.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./public/assets/js/index.js");
/******/ 	
/******/ })()
;