const search = document.getElementById('search');
const submit = document.getElementById('submit');
const randomBtn = document.getElementById('random');
const resultHeading = document.getElementById('result-heading');
const mealsEl = document.getElementById('meals');
const singleMealEl = document.getElementById('single-meal');


function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDom(meal);
        }
        )

}


function addMealToDom(meal) {
    const ingredients = [];
    console.log(meal);
    for (let i = 1; i < 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    console.log(ingredients);
    singleMealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}"/>
            <div class="singleMealInfo">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strCategory ? `<p>${meal.strArea}` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        <div>

    `;
}

function randomMeal() {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            addMealToDom(data.meals[0]);
        });
}


function searchMeal(e) {
    e.preventDefault();
    singleMealEl.innerHTML = '';
    const term = search.value;
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>There are no search results</h2>`;
                } else {
                    mealsEl.innerHTML = `
                    ${data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}"/>
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `).join('')}
                `
                }
            }
            );
    } else {
        alret('please enter a letter');
    }
}


//events

submit.addEventListener('submit', searchMeal);
mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    console.log(mealInfo);
    if (mealInfo) {
        const mealID = mealInfo.getAttribute("data-mealid");
        getMealById(mealID);
    }
});

randomBtn.addEventListener('click', randomMeal);