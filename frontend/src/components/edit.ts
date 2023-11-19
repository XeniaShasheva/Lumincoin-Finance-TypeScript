import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {UrlManager} from "../utils/url-manager";
import {QueryParamsType} from "../types/query-params.type";
import {EditAllType} from "../types/edit-all.type";
import { CategoriesType } from "../types/categories.type";

export class Edit {
    public routeParams: QueryParamsType;
    public categorie: CategoriesType | null;
    public input: HTMLCollectionOf<HTMLInputElement>;
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.init();
        this.input = document.getElementsByTagName('input');
        this.categorie = null;
    }

   private async init(): Promise<void> {
        const that: Edit = this;

        try {
            const result = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id)

            if (result) {
                this.categorie = result;
                if(this.categorie) {
                   this.input[0].value = this.categorie.type;
                if (this.categorie.type === 'income') {
                    this.input[0].value = 'доход'
                }

                if (this.categorie.type === 'expense') {
                    this.input[0].value = 'расход'
                }
                this.input[0].setAttribute('disabled', 'disabled');
                this.input[1].setAttribute('disabled', 'disabled');
                this.input[1].value = this.categorie.category
                this.input[2].value= this.categorie.amount
                this.input[3].value = this.categorie.date
                this.input[4].value = this.categorie.comment
 
                }

                
            }
        } catch (error) {
            return console.log(error);
        }

        const create: HTMLElement|null = document.getElementById('create');
        if(create) {
            create.onclick = function () {
                that.create();
            }
        }

        const cancel: HTMLElement | null = document.getElementById('cancel');
        if(cancel){
            cancel.onclick = function () {
                location.href = '#/all';
            }
        }

    }


  private async create(): Promise<void> {
       try {
           const response: EditAllType = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id,
               'PUT', {
                   type: this.input[0].value,
                   category: this.input[1].value,
                   amount:this.input[2].value,
                   comment:this.input[4].value,
                   date:this.input[3].value,
               })

           if (response.status < 200 || response.status >= 300) {
               throw new Error(response.message);
           }
           location.href = '#/all'
       } catch (error) {
           console.log(error);
           return
       }
    }
}