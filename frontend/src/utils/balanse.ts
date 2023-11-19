import { CustomHttp } from "../services/custom-http";
import configs from "../../config/config"
import { BalanceType } from "../types/balance.type";

export class Balance {
    private data: BalanceType |null;

    constructor(){
        this.data = null
        this.init()
    }

    async init(){
        try{
            const result = await CustomHttp.request(configs.host + '/balance')
            if(result){
                if(result.error){
                    throw new Error(result.message)
                }
                this.data = result;
                let balance: HTMLElement |null = document.getElementById('balance');
                if (this.data && balance) {
                    balance.innerText = this.data.balance +'$'
                }


            }
        }catch(e){
            console.log(e)
        }
    }
}