document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("add-button");
    const productNameInput = document.getElementById("product-name");
    const itemsList = document.querySelector(".items-list");
    const remainingItems = document.querySelector(".remaining-items");
    const boughtItems = document.querySelector(".bought-items");

    const DefaultItems = [
        { name: "Помідори", quantity: 2, bought: true },
        { name: "Печиво", quantity: 2, bought: false },
        { name: "Сир", quantity: 1, bought: false }
    ];

    DefaultItems.forEach(item => addItem(item.name, item.quantity, item.bought));

    function addItem(name, quantity = 1, bought = false) {
        if (isDuplicateName(name)) {
            return;
        }

        const itemDiv = document.createElement("div");
        itemDiv.className = "item";

        const itemName = document.createElement("span");
        itemName.textContent = name;
        itemName.className = bought ? "item-name bought" : "item-name";
        itemDiv.appendChild(itemName);

        if (!bought) {
            itemName.addEventListener("click", () => {
                const originalName = itemName.textContent;
                const input = document.createElement("input");
                input.type = "text";
                input.value = itemName.textContent;
                input.className = "item-name-input";

                input.addEventListener("blur", () => {
                    const newName = input.value.trim();
                    if (newName === "") {
                        itemName.textContent = originalName;
                    } else if (newName !== originalName && isDuplicateName(newName)) {
                        itemName.textContent = originalName;
                    } else {
                        itemName.textContent = newName;
                    }
                    itemDiv.replaceChild(itemName, input);
                    update();
                });

                itemDiv.replaceChild(input, itemName);
                input.focus();
            });
        }

        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";
        itemDiv.appendChild(quantityControls);

        const minusButton = document.createElement("button");
        minusButton.className = "minus-button";
        minusButton.textContent = "-";
        minusButton.disabled = quantity === 1;
        minusButton.dataset.tooltip = "Зменшити кількість";
        quantityControls.appendChild(minusButton);

        const quantitySpan = document.createElement("span");
        quantitySpan.className = "item-quantity";
        quantitySpan.textContent = quantity;
        quantityControls.appendChild(quantitySpan);

        const plusButton = document.createElement("button");
        plusButton.className = "plus-button";
        plusButton.textContent = "+";
        plusButton.dataset.tooltip = "Збільшити кількість";
        quantityControls.appendChild(plusButton);

        minusButton.addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                quantitySpan.textContent = quantity;
                minusButton.disabled = quantity === 1;
                update();
            }
        });

        plusButton.addEventListener("click", () => {
            quantity++;
            quantitySpan.textContent = quantity;
            minusButton.disabled = false;
            update();
        });

        const itemActions = document.createElement("div");
        itemActions.className = "item-actions";
        itemDiv.appendChild(itemActions);

        const boughtButton = document.createElement("button");
        boughtButton.className = "bought-button";
        boughtButton.textContent = bought ? "Не куплено" : "Куплено";
        boughtButton.dataset.tooltip = "Змінити статус";
        itemActions.appendChild(boughtButton);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "x";
        deleteButton.dataset.tooltip = "Видалити товар";
        if (bought) deleteButton.style.display = "none";
        itemActions.appendChild(deleteButton);

        boughtButton.addEventListener("click", () => {
            bought = !bought;
            itemName.className = bought ? "item-name bought" : "item-name";
            boughtButton.textContent = bought ? "Не куплено" : "Куплено";
            plusButton.style.display = bought ? "none" : "flex";
            minusButton.style.display = bought ? "none" : "flex";
            deleteButton.style.display = bought ? "none" : "inline-block";
            quantitySpan.style.display = 'visible';

            // Remove the click listener for editing the name if bought
            if (bought) {
                itemName.replaceWith(itemName.cloneNode(true));
            } else {
                itemName.addEventListener("click", () => {
                    const originalName = itemName.textContent;
                    const input = document.createElement("input");
                    input.type = "text";
                    input.value = itemName.textContent;
                    input.className = "item-name-input";

                    input.addEventListener("blur", () => {
                        const newName = input.value.trim();
                        if (newName === "") {
                            itemName.textContent = originalName;
                        } else if (newName !== originalName && isDuplicateName(newName)) {
                            alert("Item with this name already exists.");
                            itemName.textContent = originalName;
                        } else {
                            itemName.textContent = newName;
                        }
                        itemDiv.replaceChild(itemName, input);
                        update();
                    });

                    itemDiv.replaceChild(input, itemName);
                    input.focus();
                });
            }
            update();
        });

        deleteButton.addEventListener("click", () => {
            itemsList.removeChild(itemDiv);
            update();
        });

        itemsList.appendChild(itemDiv);
        productNameInput.value = "";
        productNameInput.focus();
        update();
    }

    function isDuplicateName(name) {
        const items = itemsList.querySelectorAll(".item-name");
        for (const item of items) {
            if (item.textContent.trim().toLowerCase() === name.trim().toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    function update() {
        remainingItems.innerHTML = "";
        boughtItems.innerHTML = "";

        const items = itemsList.querySelectorAll(".item");
        items.forEach(item => {
            const name = item.querySelector(".item-name").textContent;
            const quantity = item.querySelector(".item-quantity").textContent;
            const bought = item.querySelector(".item-name").classList.contains("bought");

            const badge = document.createElement("div");
            badge.className = "badge";
            if (bought) badge.classList.add("bought");
            badge.innerHTML = `${bought ? `<strike>${name}</strike>` : name} <span class="badge-count">${bought ? `<strike>${quantity}</strike>` : quantity}</span>`;

            if (bought) {
                boughtItems.appendChild(badge);
            } else {
                remainingItems.appendChild(badge);
            }
        });
    }

    addButton.addEventListener("click", () => {
        const productName = productNameInput.value.trim();
        if (productName) {
            addItem(productName);
        }
    });

    productNameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const productName = productNameInput.value.trim();
            if (productName) {
                addItem(productName);
            }
        }
    });
});
