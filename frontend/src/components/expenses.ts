import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {IncomeType} from "../types/income.type";
import {DefaultResponseType} from "../types/default-response.type";

export class Expenses {
    private expense: IncomeType[] = [];
    public newElement: HTMLElement | null;
    public yesElement: HTMLElement | null;
    private noElement: HTMLElement | null;
    constructor() {
        this.expense = [];
        this.newElement = null;
        this.yesElement = null;
        this.noElement = null;
        this.init();


    }

    private async init(): Promise<void> {
        try {
            const result: DefaultResponseType | IncomeType[] = await CustomHttp.request(config.host + '/categories/expense');
            if (result) {
                if ((result as DefaultResponseType).error !== undefined) {
                    throw new Error((result as DefaultResponseType).message);
                }
                this.expense = result as IncomeType[];

            }
        } catch (error) {
            console.log(error);
        }
        this.expenseProcess();
    }


   private expenseProcess(): void {
        const mainOptionElement: HTMLElement | null = document.getElementById('mainExpense');
        if (this.expense && this.expense.length > 0) {
            this.expense.forEach((item: IncomeType)=> {
                const that = this;
                const main: HTMLElement | null = document.createElement('div');
                main.className = 'main-item row';
                main.setAttribute('id', item.id.toString())

                const incomeItem: HTMLElement | null = document.createElement('div');
                incomeItem.className = 'income-item';
                incomeItem.setAttribute('id', item.id.toString())

                const incomeCard: HTMLElement | null = document.createElement('div');
                incomeCard.className = 'card';

                const cardBody: HTMLElement | null = document.createElement('div');
                cardBody.className = 'card-body';
                cardBody.setAttribute('id', item.id.toString())

                const cardTitle: HTMLElement | null = document.createElement('h5');
                cardTitle.innerText = item.title;
                cardTitle.setAttribute('title', item.title);

                const btnEdit: HTMLElement | null = document.createElement('button');
                btnEdit.className = 'btn btn-primary btnEdit';
                btnEdit.setAttribute('type', 'button');
                btnEdit.innerText = 'Редактировать';
                btnEdit.setAttribute('id', item.id.toString())
                btnEdit.setAttribute('title', item.title);
                btnEdit.onclick = function () {
                    that.editProcess(<HTMLElement>this);
                }

                const btnDelete: HTMLElement | null = document.createElement('button');
                btnDelete.className = 'btn btn-danger';
                btnDelete.setAttribute('type', 'button');
                btnDelete.innerText = 'Удалить';
                btnDelete.setAttribute('id', item.id.toString())
                btnDelete.onclick = function () {
                    that.delete(<HTMLElement>this);
                }

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(btnEdit);
                cardBody.appendChild(btnDelete);

                incomeCard.appendChild(cardBody);
                incomeItem.appendChild(incomeCard);

                if(mainOptionElement) {
                    mainOptionElement.insertBefore(incomeItem, mainOptionElement.firstChild);
                }
            })
        }
        this.newProcess();
    }


    private editProcess(element: HTMLElement) {
        const title: string | null = element.getAttribute('title');
        const dataId: string | null = element.getAttribute('id');
        if (dataId) {
            location.href = '#/editExpenses?id=' + dataId + '&type=' + title;
        }
    }

    private delete (element: HTMLElement) {
        let popup = document.getElementById('popup');
        if(popup) {
            popup.style.display = 'block';
            this.yesElement = document.getElementById('yes');
            this.noElement = document.getElementById('no');
            if (this.yesElement) {
                this.yesElement.onclick = async function () {
                    const dataId = element.getAttribute('id');
                    try {
                        const result = await CustomHttp.request(config.host + '/categories/expense/' + dataId, 'DELETE');
                        if (result) {
                            if (result.error) {
                                throw new Error(result.message);
                            }
                            if(popup) {
                                popup.style.display = 'none';
                                location.href = '#/expenses'
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
        if(this.noElement) {
            this.noElement.onclick = function () {
                if(popup) {
                    popup.style.display = 'none'
                }
            }
        }
    }

    private newProcess(): void {
        this.newElement = document.getElementById('new');
        if(this.newElement) {
            this.newElement.onclick = function () {
                window.location.href = '#/newExpenses';
            }
        }
    }

}
