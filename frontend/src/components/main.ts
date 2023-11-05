import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class Main{
    private result: HTMLElement | null;
    private Month: Number;
    readonly dateInterval: String;
    private dateTo: String;
    private dateYear: any;
    private dateMonth: String;
    private dateDay: String;
    private canvasIncome: HTMLElement | null;
    private contextIncome: HTMLElement | null;
    private canvasExpense: HTMLElement | null;
    private contextExpense: HTMLElement | null;
    private expense: [];
    private income: [];
    private dataIncome: [];
    private amountsIncome:[];
    private dataExpense: [];
    private amountsExpense:[];
    private interval: any;

    constructor(){
        let button: NodeListOf<any> = document.querySelectorAll('.btn-information')
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
        this.dateYear = new Date().getFullYear().toString();
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

                (document.getElementById('canvas1')as HTMLElement).innerHTML = ``
                (document.getElementById('canvas2')as HTMLElement).innerHTML = ``
                (document.getElementById('canvas1')as HTMLElement).innerHTML = `<canvas class="" id="income"></canvas>`;
                (document.getElementById('canvas2')as HTMLElement).innerHTML = `<canvas  id="expense"></canvas>`;

                this.canvasIncome = document.getElementById('income');
                this.contextIncome = this.canvasIncome.getContext('2d');
                this.canvasExpense = document.getElementById('expense');
                this.contextExpense = this.canvasExpense.getContext('2d');

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
        for(let i =0; i<this.result.length;i++){
            if(this.result[i].type === 'expense'){
                this.expense.push(this.result[i]);
            }else{
                this.income.push(this.result[i]);
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

    private showChar(amountsExpense,dataExpense, context): void{
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
        let chart = new Chart(context,config);
    }

    private sort(type,arr): void{
        let holder = {};
        arr.forEach(function(d) {
            if (holder.hasOwnProperty(d.category)) {
                holder[d.category] = holder[d.category] + d.amount;
            } else {
                holder[d.category] = d.amount;
            }
        });

        let sameComsart = [];
        for (let prop in holder) {
            sameComsart.push({ category: prop, amount: holder[prop] });
        }

        for(let i =0; i<sameComsart.length;i++){
            if(type === 'expense'){
                this.dataExpense.push(sameComsart[i].category);
                this.amountsExpense.push(sameComsart[i].amount);
            } else if(type === 'income'){
                this.dataIncome.push(sameComsart[i].category);
                this.amountsIncome.push(sameComsart[i].amount);
            }
        }

    }
}