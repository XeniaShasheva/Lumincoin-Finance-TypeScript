import config from "../../config/config";
import {RefreshResponseType} from "../types/refresh-response.type";
import {UserInfoType} from "../types/user-info.type";
import {LogoutResponseType} from "../types/logout-response.type";


export class Auth {

    public static accessTokenKey = 'accessToken';
    public static refreshTokenKey = 'refreshToken';
    public static categoriesInfoKey = {};
    public static userInfoName = 'userName';



   public static async processUnauthorizedResponse():Promise<boolean> {
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
         if (refreshToken) {
            const response: Response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {
                const result: RefreshResponseType | null = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    return true;
                }
            }
     }
         this.removeTokens();
        location.href = '#/'
        return false;
    }

    public static async logout(): Promise<boolean> {
        const refreshToken: string| null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });
            if (response && response.status === 200) {
                const result: LogoutResponseType |null = await response.json();
                if (result && !result.error) {
                    localStorage.removeItem(Auth.userInfoName);
                    return true;
                }
            }
        }
        Auth.removeTokens();
        localStorage.removeItem(Auth.userInfoName);
        return false;
    }
public static setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    // static getCategoriesInfo() {
    //     const categoriesInfo = localStorage.getItem(this.categoriesInfoKey);
    //     if (categoriesInfo) {
    //         return JSON.parse(categoriesInfo);
    //     }
    //     return null;
    // }

    private static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static setUserInfo(info: UserInfoType): void{
        localStorage.setItem(this.userInfoName, JSON.stringify(info));

    }
   public static getUserInfo():UserInfoType | null {
        const userInfoName: string | null = localStorage.getItem(this.userInfoName);
               if (userInfoName) {
            return JSON.parse(userInfoName);

        }
        return  null;


    }


}