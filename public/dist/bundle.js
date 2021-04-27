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

/***/ "./public/assets/js/index.js":
/*!***********************************!*\
  !*** ./public/assets/js/index.js ***!
  \***********************************/
/***/ (() => {

eval("var transactions = [];\nvar myChart;\nfetch(\"/api/transaction\").then(function (response) {\n  return response.json();\n}).then(function (data) {\n  // save db data on global variable\n  transactions = data;\n  populateTotal();\n  populateTable();\n  populateChart();\n});\n\nfunction populateTotal() {\n  // reduce transaction amounts to a single total value\n  var total = transactions.reduce(function (total, t) {\n    return total + parseInt(t.value);\n  }, 0);\n  var totalEl = document.querySelector(\"#total\");\n  totalEl.textContent = total;\n}\n\nfunction populateTable() {\n  var tbody = document.querySelector(\"#tbody\");\n  tbody.innerHTML = \"\";\n  transactions.forEach(function (transaction) {\n    // create and populate a table row\n    var tr = document.createElement(\"tr\");\n    tr.innerHTML = \"\\n      <td>\".concat(transaction.name, \"</td>\\n      <td>\").concat(transaction.value, \"</td>\\n    \");\n    tbody.appendChild(tr);\n  });\n}\n\nfunction populateChart() {\n  // copy array and reverse it\n  var reversed = transactions.slice().reverse();\n  var sum = 0; // create date labels for chart\n\n  var labels = reversed.map(function (t) {\n    var date = new Date(t.date);\n    return \"\".concat(date.getMonth() + 1, \"/\").concat(date.getDate(), \"/\").concat(date.getFullYear());\n  }); // create incremental values for chart\n\n  var data = reversed.map(function (t) {\n    sum += parseInt(t.value);\n    return sum;\n  }); // remove old chart if it exists\n\n  if (myChart) {\n    myChart.destroy();\n  }\n\n  var ctx = document.getElementById(\"myChart\").getContext(\"2d\");\n  myChart = new Chart(ctx, {\n    type: 'line',\n    data: {\n      labels: labels,\n      datasets: [{\n        label: \"Total Over Time\",\n        fill: true,\n        backgroundColor: \"#6666ff\",\n        data: data\n      }]\n    }\n  });\n}\n\nfunction sendTransaction(isAdding) {\n  var nameEl = document.querySelector(\"#t-name\");\n  var amountEl = document.querySelector(\"#t-amount\");\n  var errorEl = document.querySelector(\".form .error\"); // validate form\n\n  if (nameEl.value === \"\" || amountEl.value === \"\") {\n    errorEl.textContent = \"Missing Information\";\n    return;\n  } else {\n    errorEl.textContent = \"\";\n  } // create record\n\n\n  var transaction = {\n    name: nameEl.value,\n    value: amountEl.value,\n    date: new Date().toISOString()\n  }; // if subtracting funds, convert amount to negative number\n\n  if (!isAdding) {\n    transaction.value *= -1;\n  } // add to beginning of current array of data\n\n\n  transactions.unshift(transaction); // re-run logic to populate ui with new record\n\n  populateChart();\n  populateTable();\n  populateTotal(); // also send to server\n\n  fetch(\"/api/transaction\", {\n    method: \"POST\",\n    body: JSON.stringify(transaction),\n    headers: {\n      Accept: \"application/json, text/plain, */*\",\n      \"Content-Type\": \"application/json\"\n    }\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    if (data.errors) {\n      errorEl.textContent = \"Missing Information\";\n    } else {\n      // clear form\n      nameEl.value = \"\";\n      amountEl.value = \"\";\n    }\n  })[\"catch\"](function (err) {\n    // fetch failed, so save in indexed db\n    saveRecord(transaction); // clear form\n\n    nameEl.value = \"\";\n    amountEl.value = \"\";\n  });\n}\n\ndocument.querySelector(\"#add-btn\").onclick = function () {\n  sendTransaction(true);\n};\n\ndocument.querySelector(\"#sub-btn\").onclick = function () {\n  sendTransaction(false);\n};\n\n//# sourceURL=webpack://budget-app/./public/assets/js/index.js?");

/***/ }),

/***/ "./public/assets/js/indexedDb.js":
/*!***************************************!*\
  !*** ./public/assets/js/indexedDb.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"checkForIndexedDb\": () => (/* binding */ checkForIndexedDb),\n/* harmony export */   \"useIndexedDb\": () => (/* binding */ useIndexedDb)\n/* harmony export */ });\nfunction checkForIndexedDb() {\n  if (!window.indexedDB) {\n    console.log(\"Your browser doesn't support a stable version of IndexedDB.\");\n    return false;\n  }\n\n  return true;\n}\nfunction useIndexedDb(databaseName, storeName, method, object) {\n  return new Promise(function (resolve, reject) {\n    var request = window.indexedDB.open(databaseName, 1);\n    var db, tx, store;\n\n    request.onupgradeneeded = function (e) {\n      var db = request.result;\n      db.createObjectStore(storeName, {\n        keyPath: \"_id\"\n      });\n    };\n\n    request.onerror = function (e) {\n      console.log(\"There was an error\");\n    };\n\n    request.onsuccess = function (e) {\n      db = request.result;\n      tx = db.transaction(storeName, \"readwrite\");\n      store = tx.objectStore(storeName);\n\n      db.onerror = function (e) {\n        console.log(\"error\");\n      };\n\n      if (method === \"put\") {\n        store.put(object);\n      } else if (method === \"get\") {\n        var all = store.getAll();\n\n        all.onsuccess = function () {\n          resolve(all.result);\n        };\n      } else if (method === \"delete\") {\n        store[\"delete\"](object._id);\n      }\n\n      tx.oncomplete = function () {\n        db.close();\n      };\n    };\n  });\n} // let db;\n// let budgetVersion;\n// // Create a new db request for a \"budget\" database.\n// const request = indexedDB.open('BudgetDB', budgetVersion || 21);\n// request.onupgradeneeded = function (e) {\n//   console.log('Upgrade needed in IndexDB');\n//   const { oldVersion } = e;\n//   const newVersion = e.newVersion || db.version;\n//   console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);\n//   db = e.target.result;\n//   if (db.objectStoreNames.length === 0) {\n//     db.createObjectStore('BudgetStore', { autoIncrement: true });\n//   }\n// };\n// request.onerror = function (e) {\n//   console.log(`Woops! ${e.target.errorCode}`);\n// };\n// function checkDatabase() {\n//   console.log('check db invoked');\n//   // Open a transaction on your BudgetStore db\n//   let transaction = db.transaction(['BudgetStore'], 'readwrite');\n//   // access your BudgetStore object\n//   const store = transaction.objectStore('BudgetStore');\n//   // Get all records from store and set to a variable\n//   const getAll = store.getAll();\n//   // If the request was successful\n//   getAll.onsuccess = function () {\n//     // If there are items in the store, we need to bulk add them when we are back online\n//     if (getAll.result.length > 0) {\n//       fetch('/api/transaction/bulk', {\n//         method: 'POST',\n//         body: JSON.stringify(getAll.result),\n//         headers: {\n//           Accept: 'application/json, text/plain, */*',\n//           'Content-Type': 'application/json',\n//         },\n//       })\n//         .then((response) => response.json())\n//         .then((res) => {\n//           // If our returned response is not empty\n//           if (res.length !== 0) {\n//             // Open another transaction to BudgetStore with the ability to read and write\n//             transaction = db.transaction(['BudgetStore'], 'readwrite');\n//             // Assign the current store to a variable\n//             const currentStore = transaction.objectStore('BudgetStore');\n//             // Clear existing entries because our bulk add was successful\n//             currentStore.clear();\n//             console.log('Clearing store 🧹');\n//           }\n//         });\n//     }\n//   };\n// }\n// request.onsuccess = function (e) {\n//   console.log('success');\n//   db = e.target.result;\n//   // Check if app is online before reading from db\n//   if (navigator.onLine) {\n//     console.log('Backend online! 🗄️');\n//     checkDatabase();\n//   }\n// };\n// const saveRecord = (record) => {\n//   console.log('Save record invoked');\n//   // Create a transaction on the BudgetStore db with readwrite access\n//   const transaction = db.transaction(['BudgetStore'], 'readwrite');\n//   // Access your BudgetStore object store\n//   const store = transaction.objectStore('BudgetStore');\n//   // Add record to your store with add method.\n//   store.add(record);\n// };\n// // Listen for app coming back online\n// window.addEventListener('online', checkDatabase);\n\n//# sourceURL=webpack://budget-app/./public/assets/js/indexedDb.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	__webpack_modules__["./public/assets/js/indexedDb.js"](0, {}, __webpack_require__);
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/assets/js/index.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;