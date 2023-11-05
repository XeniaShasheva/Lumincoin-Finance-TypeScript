import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";



export class New {
    readonly page: 'createIncome' |'createExpense';
    private categories: HTMLElement | null | [];
    readonly input: HTMLCollectionOf<any>;
    private itmType: HTMLCollectionOf<Element>;
    private id: string;

    constructor(page: 'createIncome' |'createExpense'){
        this.page = page;
        this.categories = null
        this.input = document.getElementsByTagName('input')
        this.itmType = document.getElementsByClassName('dropdown-item')
        this.id = document.location.href.split('=')[1]

        if(this.page === 'createIncome'){
            this.createErn()
        }else if (this.page === 'createExpense'){
            this.createCom()
        }
        this.cancel()

        const that = this
        for(let i = 0; i < this.input.length; i ++){
            this.input[i].onchange = function(){
                that.validateForm();
            }
        }

    }


    private createErn(): void{
        let create: HTMLElement | null = document.getElementById('create')
        this.showTitle('Создание дохода', 'доход')
        this.itmTyp('income')
        let that = this
        if(create){
            create.onclick = function () {
                that.savingData(that.saveCategor(that.input[1].value),'income','/operations','POST')
            }
        }

    }
    private createCom(): void{
        let create: HTMLElement | null = document.getElementById('create')
        this.showTitle('Создание расхода','расход')
        this.itmTyp('expense')
        let that = this
        if(create) {
            create.onclick = function () {
                that.savingData(that.saveCategor(that.input[1].value),'expense','/operations','POST')
            }
        }
    }
    private async itmTyp(data): Promise<void>{
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
    private showTitle(text, type ): void{
        let input = this.input[0]
        (document.getElementById('content-title')as HTMLElement).innerText = text
        input.value = type
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
        this.categories.forEach((itm)=>{
            content +=`<li><div class="dropdown-item" id='${itm.id}'>${itm.title}</div></li>`
        })
        if(result) {
            result.innerHTML = content
            for(let i = 0; i<this.itmType.length;i++){
                this.itmType[i].onclick = function () {
                    that.input[1].value = that.itmType[i].textContent

                }
            }
        }

    }
    private validateForm(): void{
        let that =this
        let create: HTMLElement | null = document.getElementById('create')

        let y: boolean = false
        for(let i = 0;i<this.input.length-1;i++){
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
    private async savingData(id,type,url,metod): Promise<void>{
        try{
            const result = await CustomHttp.request(config.host + url,metod,{
                type: type,
                amount: this.input[2].value,
                date: this.input[3].value,
                comment: this.input[4].value,
                category_id:  Number(id)
            })

            if(result){
                location.href='#/all'
            }

        }catch(e){
            console.log(e)
        }
    }

    private saveCategor(type): object{
        let idcategor: any = null
        for(let i = 0; i < this.categories.length; i++){
            if(this.categories[i].title === type){
                idcategor= this.categories[i].id
                break
            }
        }
        return idcategor
    }

}