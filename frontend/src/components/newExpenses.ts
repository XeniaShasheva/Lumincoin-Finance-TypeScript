import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class NewExpenses {
    constructor() {
        this.init();
    }

    private init(): void {
        const that = this
        const newExpense: HTMLElement | null  = document.getElementById('newExpense');
        if(newExpense){
            newExpense.onclick = function () {
                that.newExpense();
            }
        }
        const deleteNew: HTMLElement | null = document.getElementById('deleteExpense');
        if(deleteNew) {
            deleteNew.onclick = function () {
                location.href = '#/expenses';
            }
        }
    }

    private async newExpense():Promise<void> {
        try {
            const response = await CustomHttp.request(config.host + '/categories/expense/', 'POST', {
                title: (document.getElementById('newExpenseInput')as HTMLInputElement).value,
            });

            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.message);
            }
            location.href = '#/expenses';
        } catch (error) {
            console.log(error);
        }
    }
}