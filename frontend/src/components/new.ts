import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import { CategoriesType } from "../types/categories.type";


export class New {
    readonly page: 'createIncome' |'createExpense';
    private categories: CategoriesType[] | null;
    private input: HTMLCollectionOf<HTMLInputElement>;
    private itmType:HTMLCollectionOf<Element>;
    private id: string;

    constructor(page: 'createIncome' |'createExpense'){
        this.page = page;
        this.categories = null
        this.input = document.getElementsByTagName('input');
        this.itmType = document.getElementsByClassName('dropdown-item');
        this.id = document.location.href.split('=')[1]

        if(this.page === 'createIncome'){
            this.createErn()
        }else if (this.page === 'createExpense'){
            this.createCom()
        }
        this.cancel()

        const that = this
        for(let i = 0; i < this.input.length; i ++){
            (this.input[i] as HTMLInputElement).onchange = function(){
                that.validateForm();
            }
        }

    }


    private createErn(): void{
        let create: HTMLElement | null = document.getElementById('create');
        this.showTitle('Создание дохода', 'доход');
        this.itmTyp('income');
        let that = this
        if(create){
            create.onclick = function ():void {
                that.savingData(that.saveCategor((that.input[1] as HTMLInputElement).value),('income' as any),'/operations','POST');
            }
        }

    }
    private createCom(): void{
        let create: HTMLElement | null = document.getElementById('create')
        this.showTitle('Создание расхода','расход')
        this.itmTyp('expense');
        let that = this
        if(create) {
            create.onclick = function ():void {
                that.savingData(that.saveCategor((that.input[1]as HTMLInputElement).value),('expense' as any),'/operations','POST')
            }
        }
    }
    private async itmTyp(data: string): Promise<void>{
        try{
            const result = await CustomHttp.request(config.host+'/categories/'+ data)
            if(result){
                if(result.error){
                    throw new Error(result.message)
                }
                this.categories = result
                if(this.categories){
                    this.searchType()
                }
            }
        }catch(e){
            console.log(e)
        }
    }
    private showTitle(text: string, type: string): void{
        let input = this.input[0] as HTMLInputElement;
        (document.getElementById('content-title')as HTMLElement).innerText = text;
        input.value = type;
        input.setAttribute('disabled', 'disabled')
    }
    private cancel(): void{
        (document.getElementById('cancel')as HTMLElement).onclick = function () {
            document.getElementById('form')
            location.href = '#/all'
        }
    }
    private searchType(): void{
        let that =this
        const result: HTMLElement | null = document.getElementById('dropdown-menu')
        let content = ''
        if(this.categories) {
             this.categories.forEach((itm)=>{
            content +=`<li><div class="dropdown-item" id='${itm.id}'>${itm.title}</div></li>`
        })
        }
            if(result) {
            result.innerHTML = content
            for(let i = 0; i < this.itmType.length; i++ ){
                (this.itmType[i]as HTMLElement).onclick = function () {
                    if(!that.input[1]) {
                        that.input[1].value= that.itmType[i].textContent
                    }
                }
            }
        }

    }
    private validateForm(): void{
        let that = this;
        let create: HTMLElement | null = document.getElementById('create')

        let y: boolean = false
        for(let i = 0; i < this.input.length -1; i++ ){
            if(!that.input[i].value){
                y = false
                return
            }else{
                y = true
            }
        }
        if(y === true){
            if(create) {
                create.removeAttribute('disabled');
            }

        }


    }
    private async savingData(id: number, type: number, url: string, metod: string): Promise<void>{
        try{
            const result = await CustomHttp.request(config.host + url,metod,{
                type: type,
                amount: (this.input[2]as HTMLInputElement).value,
                date: (this.input[3]as HTMLInputElement).value,
                comment: (this.input[4]as HTMLInputElement).value,
                category_id:  Number(id)
            })

            if(result){
                location.href='#/all'
            }

        }catch(e){
            console.log(e)
        }
    }

    private saveCategor(type:string): number {
        let idcategor: number | null = null;
               if(this.categories) {
                for(let i = 0; i < this.categories.length; i++){
                if(this.categories[i].title === type){
                    idcategor = this.categories[i].id
                    break
                }
            }           
        }
       return idcategor
    }

}