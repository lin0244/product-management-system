import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {User} from "../model/user";
import {Observable} from "rxjs";
import {api} from "../constants/api";
import {keys} from "../constants/keys";

@Injectable()
export class AuthorizationService {

    constructor(private http: Http) {
    }

    login(user: User): Observable<Boolean> {
        const body = JSON.stringify({username: user.username, password: user.password});
        const options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
        return this.http.post(api.LOGIN, body, options)
            .map(AuthorizationService.handleResponse)
            .catch(AuthorizationService.handleError);
    }

    static logout(): void {
        localStorage.removeItem(keys.USER_KEY);
    }

    private static handleResponse(response: Response): boolean {
        const token = response.json().token;
        let user = response.json().user;
        if (token && user) {
            user.token = token;
            localStorage.setItem(keys.USER_KEY, JSON.stringify(user));
            return true;
        }
        return false;
    }

    private static handleError() {
        return Observable.throw("Invalid username or password");
    }
}