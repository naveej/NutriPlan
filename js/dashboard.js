"use strict";

const foodForm = document.getElementById("food-form");
const nutrientResults = document.getElementById("nutrient-results");
const recommendations = document.querySelector(".recommendations");
const nutrients = document.querySelector(".nutrient__results");
const resultsContainer = document.querySelector(".result__container");
const logoutBtn = document.querySelector(".logout__btn");
const recommendationList = document.querySelector("#result");
const mealList = document.getElementById("meal");

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to fetch recommendation
const addTitle = function (title) {
  const html = `<h2 class="recommendations__title">${title}</h2>`;
  mealList.insertAdjacentHTML("beforeend", html);
};

const fetchRecommendation = function (appId, appKey, dietType, title) {
  fetch(
    `https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${appKey}&diet=${dietType}`
  )
    .then((response) => response.json())
    .then((data) => {
      addTitle(title);
      for (let i = 0; i < data.hits.length; i++) {
        const recipe = data.hits[i].recipe;
        const listItem = document.createElement("p");
        listItem.textContent = recipe.label;
        // recommendationList.appendChild(listItem);
        addRecipeImageLink(recipe);
      }
    });
};

// Function to add the recipe images with button to the result container
const addRecipeImageLink = function (recipe) {
  recommendations.classList.remove("hidden");
  nutrients.classList.remove("hidden");
  resultsContainer.classList.remove("zero__size");
  let html = `
                    <div class = "meal-item">
                        <div class = "meal-img">
                            <img src = "${recipe.image}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${recipe.label}</h3>
                            <a href = "${recipe.url}" class = "recipe__button">Get Recipe</a>
                        </div>
                    </div>
                `;
  mealList.insertAdjacentHTML("beforeend", html);
};

// Calculate Nutrient Density
function calculateNutrientDensity(totalFAT, totalCarbohydrate, protein) {
  //nutrient density
  const calorieDensity =
    (totalFAT * 9 + totalCarbohydrate * 4 + protein * 4) / 100;
  return protein / calorieDensity; //nutrient density
}

// Nutrient Intake Distribution
function calculateNutrientIntakeDistribution(
  fatGms,
  chocdfGms,
  procntGms,
  { FAT, CHOCDF, PROCNT }
) {
  const total = FAT + CHOCDF + PROCNT;
  const nutrientIntakeDistribution = {
    FAT: (fatGms * total) / 100,
    CHOCDF: (chocdfGms * total) / 100,
    PROCNT: (procntGms * total) / 100,
  };

  return nutrientIntakeDistribution;
}

const APP_ID = "f14bc3eb";
const APP_KEY = "bae3a04e6b06e43d16dfed5c2f322ada";

function getRecommendations(nutrientIntakeDistribution, targetNutrients) {
  if (nutrientIntakeDistribution.FAT < targetNutrients.FAT) {
    // Retrieve recipe data for high FAT foods
    fetchRecommendation(APP_ID, APP_KEY, "balanced", "FAT");
  }

  if (nutrientIntakeDistribution.CHOCDF < targetNutrients.CHOCDF) {
    // Retrieve recipe data for high carbohydrate foods
    fetchRecommendation(APP_ID, APP_KEY, "high-fiber", "CHOCDF");
  }

  if (nutrientIntakeDistribution.PROCNT < targetNutrients.PROCNT) {
    // Retrieve recipe data for high protein foods
    fetchRecommendation(APP_ID, APP_KEY, "high-protein", "PROCNT");
  }
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fetch the Intake details on form submit
foodForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const foodInput = document.getElementById("food-input").value;

  // API call to retrieve nutrient data for the food
  fetch(
    "https://trackapi.nutritionix.com/v2/natural/nutrients?timestamp=${timestamp}",
    {
      method: "POST",
      headers: {
        "x-app-id": "eb69f562",
        "x-app-key": "6abfb6d1e676f6d3dde0e5156547afbf",
        "Content-Type": "application/json", // Add the Content-Type header
      },
      body: JSON.stringify({ query: foodInput }), // Convert the body to a JSON string
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // Clear previous results
      nutrientResults.innerHTML = "";
      // recommendationList.innerHTML = "";
      mealList.innerHTML = "";
      recommendations.classList.add("hidden");
      nutrients.classList.add("hidden");
      resultsContainer.classList.add("zero__size");
      const food = data.foods[0];
      const targetNutrients = {
        FAT: 60,
        CHOCDF: 300,
        PROCNT: 50,
      };

      const nutrientDensity = calculateNutrientDensity(
        food.nf_total_fat,
        food.nf_total_carbohydrate,
        food.nf_protein
      );
      //nutrient density

      const nutrientDistribution = calculateNutrientIntakeDistribution(
        food.nf_total_fat,
        food.nf_total_carbohydrate,
        food.nf_protein,
        targetNutrients
      );
      getRecommendations(nutrientDistribution, targetNutrients);
      nutrientResults.innerHTML = `
        <h2>${food.food_name}</h2>
        <p>Quantity: ${food.serving_qty}</p>
        <p>Nutrient Density: ${nutrientDensity.toFixed(2)}</p>
        <p>Nutrient Distribution:</p>
          <p>FAT: ${food.nf_total_fat}%</p>
          <p>CHOCDF: ${food.nf_total_carbohydrate}%</p>
          <p>Protein: ${food.nf_protein}%</p>
      `;
    })
    .catch((error) => {
      nutrientResults.innerHTML =
        "<p>An error occurred while retrieving nutrient data.</p>";
      console.error(error);
    });
});

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Logout event
logoutBtn.addEventListener("click", function (e) {
  e.preventDefault();

  Swal.fire({
    title: "Logging Out",
    text: "You are being logged out",
    icon: "warning",
    confirmButtonText: "OK",
  }).then(function () {
    window.location.href = "logout.php";
  });
});

// Logout button position
window.addEventListener("scroll", function () {
  const topMove = window.scrollY + 5;
  logoutBtn.style.top = `${topMove}px`;
});
