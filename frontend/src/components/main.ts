import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import { CategoriesType } from "../types/categories.type";

export class Main{
    private result: [] | null;
    private Month: number;
    readonly dateInterval: String;
    private dateTo: String;
    private dateYear: number;
    private dateMonth: String;
    private dateDay: String;
    private canvasIncome: HTMLCanvasElement | null;
    private contextIncome: CanvasRenderingContext2D | null;
    private canvasExpense: HTMLCanvasElement | null;
    private contextExpense: CanvasRenderingContext2D | null;
    private expense: [];
    private income: [];
    private dataIncome: [];
    private amountsIncome:number[];
    private dataExpense: [];
    private amountsExpense: [];
    private interval: String | undefined;

    constructor(){
        let button: NodeListOf<HTMLElement> = document.querySelectorAll('.btn-information')
        button.forEach((itm)=>{
            itm.addEventListener('click', function(){
                button.forEach((btn)=>{
                    btn.style.backgroundColor='transparent'
                    btn.style.color='#6c757d'
                })
                this.style.backgroundColor='#6c757d'
                this.style.color='white'
            })
        })

        this.result = null;
        this.Month = new Date().getMonth() + 1;
        this.dateInterval = new Date().getFullYear().toString() + '-' + this.Month.toString() + '-' + new Date().getDate().toString()
            + '&dateTo' + new Date().getFullYear().toString() + '-' + this.Month.toString() + '-' + new Date().getDate().toString();
        this.dateTo = '&dateTo' + new Date().getFullYear().toString() + '-' + this.Month.toString() + '-' + new Date().getDate().toString();
        this.dateYear = new Date().getFullYear();
        this.dateMonth = this.Month.toString();
        this.dateDay = new Date().getDate().toString();
        this.canvasIncome = null;
        this.contextIncome = null;
        this.canvasExpense = null;
        this.contextExpense = null;
        this.expense = [];
        this.income = [];
        this.dataIncome = [];
        this.amountsIncome = [];
        this.dataExpense = [];
        this.amountsExpense = [];
        this.sorting();
    }
    private async init(dataId = this.dateInterval): Promise<void>{
        try{
            const result = await CustomHttp.request(config.host+'/operations?period=interval&dateFrom=' + dataId);
            if(result){
                if(result.error){
                    throw new Error(result.message);
                }
                this.result = result;

                let canvas1: HTMLElement | null = document.getElementById('canvas1');
                let canvas2: HTMLElement | null = document.getElementById('canvas2');
                if (canvas1 && canvas2) {
                    canvas1.innerHTML = ``;
                    canvas2.innerHTML = ``;
                }
                (document.getElementById('canvas1')as HTMLElement).innerHTML = `<canvas class="" id="income"></canvas>`;
                (document.getElementById('canvas2')as HTMLElement).innerHTML = `<canvas  id="expense"></canvas>`;

                if(this.canvasIncome) {
                  this.contextIncome = this.canvasIncome.getContext('2d');  
                }
                this.canvasExpense = document.getElementById('expense') as HTMLCanvasElement;
                if (this.canvasExpense) {
                     this.contextExpense = this.canvasExpense.getContext('2d');
                }                                   
                this.canvasIncome = document.getElementById('income') as HTMLCanvasElement;
              

                this.dataExpense =[];
                this.amountsExpense = [];
                this.dataIncome = [];
                this.amountsIncome = [];
                this.expense=[];
                this.income = [];
                this.canvas();
            }
        }catch(error){
            console.log(error);
        }
    }
    private canvas(): void{
        if(this.result) {
            for(let i =0; i <this.result.length ;i++ ){
            if((this.result[i]as any).type === 'expense'){
                this.expense.push(this.result[i]);
            }else{
                this.income.push(this.result[i]);
            } 
        }
       
        }

        this.sort('expense',this.expense);
        this.sort('income',this.income);
        this.showChar(this.amountsExpense,this.dataExpense,this.contextExpense);
        this.showChar(this.amountsIncome,this.dataIncome,this.contextIncome);
    }

   private sorting(): void{
        const that: Main = this
        let data = new Date();
        this.init(this.dateInterval);

        (document.getElementById('today')as HTMLElement).onclick = function () {
            that.interval = that.dateInterval;
            that.init(that.interval);
        }

        let week: HTMLElement | null =  document.getElementById('week');
        if(week) {
                week.onclick = function () {
                let startDate = new Date();
                startDate.setDate(data.getDate() - 7);
                that.interval = startDate.getFullYear()+'-'+startDate.getMonth()+'-'+startDate.getDate()+that.dateTo;
                that.init(that.interval);
            }
        }

        let month: HTMLElement |null = document.getElementById('month');
        if (month) {
                month.onclick = function () {
                let startDate = new Date();
                startDate.setMonth(data.getMonth() - 1);
                that.interval = startDate.getFullYear()+'-'+startDate.getMonth()+'-'+startDate.getDate()+that.dateTo;
                that.init(that.interval);
            }
        }

        let year: HTMLElement | null = document.getElementById('year');
        if(year) {
            year.onclick = function () {
                that.interval = that.dateYear-1+'-'+that.dateMonth +'-'+that.dateDay+that.dateTo;
                that.init(that.interval);

            }
        }

        let allAll: HTMLElement |null = document.getElementById('allAll');
        if(allAll) {
        allAll.onclick = function () {
                that.interval = '1999-01-01&dateTo=2300-09-13';
                that.init(that.interval);

            }
        }

        let interval: HTMLElement |null = document.getElementById('interval');
        if(interval) {
            interval.onclick = function () {
                let dateFrom = (document.getElementById('dateFrom')as HTMLInputElement).value;
                let dateTo = (document.getElementById('dateTo')as HTMLInputElement).value;
                that.interval = dateFrom+'&dateTo='+dateTo;
                that.init(that.interval);
            }
        }

    }

    private showChar(amountsExpense: number[],dataExpense: string[], context: CanvasRenderingContext2D | null): void{
        let data  = {
            labels: dataExpense,
            datasets:[{
                data: amountsExpense,
            }]
        }
        let config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        }
        // let chart = new Chart(context,config);
    }

    private sort(type: string, array:CategoriesType[]): void{
        let sort: Record<string, number>  = {};
        array.forEach(function(d: CategoriesType): void {
            if (sort.hasOwnProperty(d.category)) {
                sort[d.category] = sort[d.category] + d.amount;
            } else {
                sort[d.category] = d.amount;
            }
        });

        let sortSort: object[] = [];
            for (let prop in sort) {
                sortSort.push({ category: prop, amount: sort[prop]});
        }
        for(let i =0; i < sortSort.length; i++ ){
            if(type === 'expense'){
                this.dataExpense.push(sortSort[i].category);
                this.amountsExpense.push(sortSort[i].amount);
            } else if(type === 'income'){
                this.dataIncome.push(sortSort[i].category);
                this.amountsIncome.push(sortSort[i].amount);
            }
        }

    }
}