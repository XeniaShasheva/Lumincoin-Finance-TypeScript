import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class NewIncome {
    constructor() {
        this.init();

    }

    private init():void {
        const that = this
        const newIncome: HTMLElement | null = document.getElementById('newIncome');
        if(newIncome) {
            newIncome.onclick = function () {
                that.new();
            };
        }
        const deleteNew: HTMLElement | null = document.getElementById('deleteNew');
        if(deleteNew) {
            deleteNew.onclick = function () {
                location.href = '#/income';
            }
        }
    }

    private async new():Promise<void> {
        try {
            const response = await CustomHttp.request(config.host + '/categories/income/', 'POST', {
                title: (document.getElementById('newIncomeInput')as HTMLInputElement).value,
            });

            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.message);
            }
            location.href = '#/income';
        } catch (error) {
            console.log(error);
            return
        }
    }
}
