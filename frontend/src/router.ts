import {Form} from "./components/form";
import {Income} from "./components/income";
import {Expenses} from "./components/expenses";
import {EditIncome} from "./components/editIncome";
import {NewIncome} from "./components/newIncome";
import {NewExpenses} from "./components/newExpenses";
import {EditExpenses} from "./components/editExpenses";
import {All} from "./components/all";
import {New} from "./components/new";
import {Edit} from "./components/edit";
import {Main} from "./components/main";
import {Sidebar} from "./components/sidebar";
import {Auth} from "./services/auth";
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/user-info.type";



export class Router {
    readonly sidebar: HTMLElement | null;
    readonly layout: HTMLElement | null;
    readonly userInfo: HTMLElement | null;
    readonly content: HTMLElement | null;
    readonly title: HTMLElement | null;

    private routes: RouteType[];
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.layout = document.getElementById('layout');
        this.userInfo = document.getElementById('userInfo');
        this.content = document.getElementById('content');
        this.title = document.getElementById('title');
        this.routes = [
            {
                route: '#/login',
                title: 'Авторизация',
                template: 'templates/login.html',
                load: () => {
                    new Form('login');

                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                load: () => {
                    new Form('signup');

                },
            },
            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                load: () => {
                    new Main();
                    new Sidebar();
                },
            },
            {
                route: '#/income',
                title: 'Категории Доходов',
                template: 'templates/income.html',
                load: () => {
                    new Income();
                    new Sidebar();
                }
            },
            {
                route: '#/expenses',
                title: 'Категории Расходов',
                template: 'templates/expenses.html',
                load: () => {
                    new Expenses();
                    new Sidebar();
                },
            },
            {
                route: '#/editIncome',
                title: 'Редактирование категории Доходов',
                template: 'templates/editIncome.html',
                load: () => {
                    new EditIncome();
                    new Sidebar();
                },
            },
            {
                route: '#/newIncome',
                title: 'Создание категории Доходов',
                template: 'templates/newIncome.html',
                load: () => {
                    new NewIncome();
                    new Sidebar();
                },
            },
            {
                route: '#/newExpenses',
                title: 'Создание категории Расходов',
                template: 'templates/newExpenses.html',
                load: () => {
                    new NewExpenses();
                    new Sidebar();
                },
            },
            {
                route: '#/editExpenses',
                title: 'Редактирование категории Расходов',
                template: 'templates/editExpenses.html',
                load: () => {
                    new EditExpenses();
                    new Sidebar();
                },
            },
            {
                route: '#/all',
                title: 'Доходы и Расходы',
                template: 'templates/all.html',
                load: () => {
                    new All();
                    new Sidebar();
                },
            },
            {
                route: '#/creationIncome',
                title: 'Создание Дохода/Расхода',
                template: 'templates/new.html',
                load: () => {
                    new New('createIncome');
                    new Sidebar();
                },
            },
            {
                route: '#/creationExpense',
                title: 'Создание Дохода/Расхода',
                template: 'templates/new.html',
                load: () => {
                    new New('createExpense');
                    new Sidebar();
                },
            },
            {
                route: '#/edit',
                title: 'Редактирование Дохода/Расхода',
                template: 'templates/edit.html',
                load: () => {
                    new Edit();
                    new Sidebar();
                },
            },
        ]
    }

    public async openRoute(): Promise<void> {
        const urlRoute: string = window.location.hash.split('?')[0];
        if(urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
            return;
        }
        const newRoute: RouteType | undefined  = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if(!newRoute) {
            window.location.href = '#/login';
            return;
        }

        if(!this.content || !this.title || !this.userInfo || !this.layout
        || !this.sidebar) {
            if(urlRoute === '#/signup') {
                return
            } else {
                window.location.href ='#/signup'
                return
            }
        }
        this.content.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.title.innerText = newRoute.title;

        const userInfoName: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);

        if(userInfoName && accessToken){
            this.userInfo.innerText = userInfoName.name + ' ' + userInfoName.lastName;
            this.layout.style.display = 'flex';
            this.sidebar.style.display = 'flex';
        } else {
            this.layout.style.display = 'block';
            this.sidebar.style.display = 'none';
        }
        newRoute.load();
    }
}