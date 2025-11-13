import { JSONHandling } from '../utils/json-file';

import { test as baseTest } from '@playwright/test';
// import { LoginPage, InventoryPage,  CartPage, CheckoutPage, MenuPage, TodoApiPage} from '../pages/index';
import { TodoApiPage } from '../pages';

//Export
export { expect } from '@playwright/test';

type MyFixtures = {
    // loginPage: LoginPage;
    // inventoryPage: InventoryPage;
    // cartPage: CartPage;
    // checkoutPage: CheckoutPage;
    // menuPage: MenuPage;
    todoApiPage: TodoApiPage;
}

export const test = baseTest.extend<MyFixtures>(
    {
    // loginPage: async ({ page }, use) => {
    //     await use(new LoginPage(page));
    // },
    // inventoryPage: async ({ page }, use) => {
    //     await use(new InventoryPage(page));
    // },
    // cartPage: async ({ page }, use) => {
    //     await use(new CartPage(page));
    // },
    // checkoutPage: async ({ page }, use) => {
    //     await use(new CheckoutPage(page));
    // },
    // menuPage: async ({ page }, use) => {
    //     await use(new MenuPage(page));
    // },
    todoApiPage: async ({ request }, use) => {
        await use(new TodoApiPage(request));
    }

});


export class BaseTest {

    loadDataInfo(filePath: string): any {
        const jh = new JSONHandling();
        // Check if TEST_ENV is set, if not load from root data folder
        const fullPath = process.env.TEST_ENV
            ? `../data/${process.env.TEST_ENV}/${filePath}`
            : `../data/${filePath}`;

        try {
            const dataInfo = jh.readJSONFile(fullPath);
            if (dataInfo) {
                console.log(`Data loaded successfully from file ${fullPath}`);
                return dataInfo;
            } else {
                console.error(`Error: Unable to read data from file ${fullPath}`);
            }
        } catch (error) {
            console.error(`Exception occurred while reading file ${fullPath}:`, error);
        }

        return null;
    }

}
