import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UrlManager} from "../utils/url-manager";
import {QueryParamsType} from "../types/query-params.type";
export class EditIncome {
    private income: [];
    public routeParams: QueryParamsType;
    constructor() {
        this.income = [];
        this.routeParams = UrlManager.getQueryParams();
        this.init();

    }

    private init():void {
        const that = this;
        let input = document.getElementById('input') as HTMLInputElement;
        input.value = this.routeParams.type;
        const save: HTMLElement | null = document.getElementById('save');
        if(save){
            save.onclick = function () {
                that.saveIncome();
            }
        }
        const cancel: HTMLElement | null = document.getElementById('cancel');
        if(cancel){
            cancel.onclick = function () {
                location.href = '#/income'
            }
        }
    }

    private async saveIncome(): Promise<void>{
        try {
            const response = await CustomHttp.request(config.host + '/categories/income/' + this.routeParams.id,
                'PUT', {
                    title: (document.getElementById('input')as HTMLInputElement).value,
                })
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.message);
            }
            location.href = '#/income'
        } catch (error) {
            console.log(error);
            return
        }
    }
}