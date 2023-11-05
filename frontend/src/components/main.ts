import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Main{
    constructor(){
        let button = document.querySelectorAll('.btn-information')
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
    async init(dataId = this.dateInterval){
        try{
            const result = await CustomHttp.request(config.host+'/operations?period=interval&dateFrom=' + dataId);
            if(result){
                if(result.error){
                    throw new Error(result.message);
                }
                this.result = result;

                document.getElementById('canvas1').innerHTML = ``
                document.getElementById('canvas2').innerHTML = ``
                document.getElementById('canvas1').innerHTML = `<canvas class="" id="income"></canvas>`;
                document.getElementById('canvas2').innerHTML = `<canvas  id="expense"></canvas>`;

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
    canvas(){
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

    sorting(){
        const that = this
        let data = new Date();
        this.init(this.dateInterval);

        document.getElementById('today').onclick = function () {
            that.interval = that.dateInterval;
            that.init(that.interval);
        }

        document.getElementById('week').onclick = function () {
            let startDate = new Date();
            startDate.setDate(data.getDate() - 7);
            that.interval = startDate.getFullYear()+'-'+startDate.getMonth()+'-'+startDate.getDate()+that.dateTo;
            that.init(that.interval);
        }

        document.getElementById('month').onclick = function () {
            let startDate = new Date();
            startDate.setMonth(data.getMonth() - 1);
            that.interval = startDate.getFullYear()+'-'+startDate.getMonth()+'-'+startDate.getDate()+that.dateTo;
            that.init(that.interval);
        }
        document.getElementById('year').onclick = function () {
            that.interval = that.dateYear-1+'-'+that.dateMonth +'-'+that.dateDay+that.dateTo;
            that.init(that.interval);

        }
        document.getElementById('allAll').onclick = function () {
            that.interval = '1999-01-01&dateTo=2300-09-13';
            that.init(that.interval);

        }
        document.getElementById('interval').onclick = function () {
            let dateFrom = document.getElementById('dateFrom').value;
            let dateTo = document.getElementById('dateTo').value;
            that.interval = dateFrom+'&dateTo='+dateTo;
            that.init(that.interval);
        }
    }

    showChar(amountsExpense,dataExpense, context){
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

    sort(type,arr){
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