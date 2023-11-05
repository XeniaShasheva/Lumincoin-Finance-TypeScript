import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UrlManager} from "../utils/url-manager";
import {QueryParamsType} from "../types/query-params.type";
export class EditExpenses {
    private expense: [];
    public routeParams: QueryParamsType;
    constructor() {
        this.expense = [];
        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    private init(): void {
        const that = this;
        let input = document.getElementById('inputExpense') as HTMLInputElement;
        if(input) {
            input.value = this.routeParams.type
        }
        const save: HTMLElement | null= document.getElementById('saveExpense');
        if(save) {
            save.onclick = function () {
                that.saveExpense();
            };
        }
        const deleteExpenses: HTMLElement | null = document.getElementById('deleteEdit');
        if(deleteExpenses) {
            deleteExpenses.onclick = function () {
                location.href = "#/expenses";
            }
        }
    }

    private async saveExpense(): Promise <void>{
        try {
            const response = await CustomHttp.request(config.host + '/categories/expense/' + this.routeParams.id,
                'PUT', {
                    title: (document.getElementById('inputExpense') as HTMLInputElement).value,
                })

            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.message);
            }
            location.href = '#/expenses'
        } catch (error) {
            console.log(error);
            return
        }
    }


}