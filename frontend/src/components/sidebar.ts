import {Balance} from "../utils/balanse";

export class Sidebar {
    private navLinks: HTMLCollectionOf<Element>;
    readonly toggleBtn: HTMLElement|null;
    readonly collapsedLinks:HTMLElement|null;
    readonly incomeLink:HTMLElement|null;
    readonly expenseLink:HTMLElement|null;
    private activeNavLink: Element | undefined;



    constructor() {
        let balance = new Balance().init();
        this.navLinks = document.getElementsByClassName('nav-link');
        this.toggleBtn = document.querySelector('.nav-link');
        this.collapsedLinks = document.getElementById('dashboard-collapse');
        this.incomeLink = document.getElementById('incomeSideBar');
        this.expenseLink = document.getElementById('expenseSidebar');
        this.init();
        this.active();
        this.activeNavLink;
    }


    private init():void {
        (document.getElementById('icon') as HTMLElement).onclick = function () {
            let logout: HTMLElement|null = document.getElementById('logout');
            if(logout) {
                logout.style.display = 'block';
            }
            let yesElement: HTMLElement|null = document.getElementById('yesLogout');
            let noElement: HTMLElement|null = document.getElementById('noLogout');
            let sidebar: HTMLElement|null = document.getElementById('sidebar');
            if(yesElement) {
                yesElement.onclick = function () {
                    if(logout && sidebar) {
                        logout.style.display = 'none';
                        sidebar.style.display = 'none';
                        location.href = '#/login';
                        localStorage.clear();
                    }
                }
            }
            if(noElement) {
                noElement.onclick = function () {
                    if(logout) {
                        logout.style.display = 'none';
                    }
                }
            }
        }
    }

   private active(): void {
        document.querySelectorAll('.nav-link.active').forEach(item => item.classList.remove('active'));
        this.activeNavLink = Array.from(this.navLinks).find(item => location.hash.includes(item.id));
        if(this.activeNavLink) {
            if (this.activeNavLink === this.incomeLink || this.activeNavLink === this.expenseLink) {
                if(this.toggleBtn) {
                    this.toggleBtn.classList.add('opened');
                    this.toggleBtn.classList.remove('collapsed');
                    this.toggleBtn.setAttribute('aria-expanded', 'true');
                }
                if(this.collapsedLinks) {
                    this.collapsedLinks.classList.add('show');
                }

            }
            this.activeNavLink.classList.add('active');
        }
    }


}

