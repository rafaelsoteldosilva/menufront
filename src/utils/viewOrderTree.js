import * as global from "../globalDefinitions/globalConstants";

class CategoryViewOrderNode {
    constructor(categoryId, categoryViewOrder) {
        this.categoryId = categoryId;
        this.categoryViewOrder = categoryViewOrder;
        this.dishesViewOrderList = {
            head: null,
            tail: null,
        };
        this.next = null;
    }
}

class DishViewOrderNode {
    constructor(dishId, dishViewOrder) {
        this.dishId = dishId;
        this.dishViewOrder = dishViewOrder;
        this.next = null;
    }
}

export class CategoryOrderList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    addCategoryViewOrderNode(categoryId, categoryViewOrder) {
        const newCategoryNode = new CategoryViewOrderNode(
            categoryId,
            categoryViewOrder
        );

        if (this.head === null) {
            this.head = newCategoryNode;
            this.tail = newCategoryNode;
        } else {
            this.tail.next = newCategoryNode;
            this.tail = newCategoryNode;
        }

        return newCategoryNode;
    }

    addDishViewOrderNode(categoryId, dishId, dishViewOrder) {
        const newDishNode = new DishViewOrderNode(dishId, dishViewOrder);
        let categoryNode = this.head;

        while (
            categoryNode !== null &&
            categoryNode.categoryId !== categoryId
        ) {
            categoryNode = categoryNode.next;
        }

        if (categoryNode !== null) {
            const dishList = categoryNode.dishesViewOrderList;

            if (dishList.head === null) {
                dishList.head = newDishNode;
                dishList.tail = newDishNode;
            } else {
                dishList.tail.next = newDishNode;
                dishList.tail = dishList.tail.next;
            }
        } else {
            throw new Error(global.categoryDoesNotExist);
        }
    }

    getTheLastCategoryNodeViewOrderValue() {
        return this.tail !== null
            ? this.tail.categoryViewOrder
            : global.noValue;
    }

    getTheGreatestCategoryViewOrderValue() {
        let greatestValue = global.noValue;
        let categoryNode = this.head;
        while (categoryNode !== null) {
            if (categoryNode.categoryViewOrder > greatestValue) {
                greatestValue = categoryNode.categoryViewOrder;
            }
            categoryNode = categoryNode.next;
        }
        return greatestValue;
    }

    getTheGreatesViewOrderValueCategoryId() {
        let greatestValue = global.noValue;
        let idFound = global.noValue;
        let categoryNode = this.head;
        while (categoryNode !== null) {
            if (categoryNode.categoryViewOrder > greatestValue) {
                greatestValue = categoryNode.categoryViewOrder;
                idFound = categoryNode.categoryId;
            }
            categoryNode = categoryNode.next;
        }
        return idFound;
    }

    getTheLastDishNodeViewOrderValueFromACategory(categoryId) {
        let categoryNode = this.head;

        while (
            categoryNode !== null &&
            categoryNode.categoryId !== categoryId
        ) {
            categoryNode = categoryNode.next;
        }

        if (categoryNode !== null) {
            const dishList = categoryNode.dishesViewOrderList;
            return dishList.tail !== null
                ? dishList.tail.dishViewOrder
                : global.noValue;
        } else return global.noValue;
    }

    getTheGreatestDishViewOrderValueFromACategory(categoryId) {
        let categoryNode = this.head;
        let greatestValue = global.noValue;

        while (
            categoryNode !== null &&
            categoryNode.categoryId !== categoryId
        ) {
            categoryNode = categoryNode.next;
        }

        if (categoryNode !== null) {
            let dishNode = categoryNode.dishesViewOrderList.head;
            while (dishNode !== null) {
                if (dishNode.dishViewOrder > greatestValue)
                    greatestValue = dishNode.dishViewOrder;
                dishNode = dishNode.next;
            }
            return greatestValue;
        } else return greatestValue;
    }

    getTheGreatestDishViewOrderDishIdFromACategory(categoryId) {
        let categoryNode = this.head;
        let greatestValue = global.noValue;
        let dishId = global.noValue;

        while (
            categoryNode !== null &&
            categoryNode.categoryId !== categoryId
        ) {
            categoryNode = categoryNode.next;
        }

        if (categoryNode !== null) {
            let dishNode = categoryNode.dishesViewOrderList.head;
            while (dishNode !== null) {
                if (dishNode.dishViewOrder > greatestValue) {
                    greatestValue = dishNode.dishViewOrder;
                    dishId = dishNode.dishId;
                }
                dishNode = dishNode.next;
            }
            return dishId;
        } else return dishId;
    }

    setCategoryOrderValue(categoryId, newViewOrder) {
        let categoryNode = this.head;

        while (
            categoryNode !== null &&
            categoryNode.categoryId !== categoryId
        ) {
            categoryNode = categoryNode.next;
        }
        if (categoryNode !== null) {
            categoryNode.categoryViewOrder = newViewOrder;
        } else {
            this.addCategoryViewOrderNode(categoryId, newViewOrder);
        }
    }

    setDishOrderValue(categoryId, dishId, newViewOrder) {
        let categoryNode = this.head;

        while (
            categoryNode !== null &&
            categoryNode.categoryId !== categoryId
        ) {
            categoryNode = categoryNode.next;
        }
        if (categoryNode !== null) {
            let dishNode = categoryNode.dishesViewOrderList.head;
            while (dishNode !== null && dishNode.dishId !== dishId) {
                dishNode = dishNode.next;
            }
            if (dishNode !== null) {
                dishNode.dishViewOrder = newViewOrder;
            } else {
                this.addDishViewOrderNode(categoryId, dishId, newViewOrder);
            }
        }
    }

    logElementsViewOrderList() {
        let categoryNode = this.head;
        while (categoryNode !== null) {
            let dishNode = categoryNode.dishesViewOrderList.head;
            while (dishNode !== null) {
                dishNode = dishNode.next;
            }

            categoryNode = categoryNode.next;
        }
    }
}

// good
