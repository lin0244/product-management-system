import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {environment} from "../constants/environment";
import {Product} from "../model/product";
import {Observable} from "rxjs";
import {AuthorizationService} from "../authorization/authorization.service";

@Injectable()
export class ProductService {

    constructor(private http: Http) {
    }

    loadAll() {
        return this.http.get(environment.PRODUCT_URL)
            .map((response: Response) => response.json())
            .catch(ProductService.handleError);
    }

    loadById(id: number) {
        return this.http.get(environment.PRODUCT_URL + id)
            .map((response: Response) => response.json())
            .catch(ProductService.handleError);
    }

    loadByName(name: string) {
        return this.http.get(environment.PRODUCT_URL + "name/" + name)
            .map(response => response.json())
            .catch(ProductService.handleError);
    }

    create(product: Product) {
        const body = product;
        const headers = new Headers({
            'Content-Type': 'application/json',
            'x-auth-token': AuthorizationService.getCurrentUser().token
        });
        const options = new RequestOptions({headers: headers});
        return this.http.post(environment.PRODUCT_URL, body, options)
            .map((response: Response) => response.status === 201)
            .catch(ProductService.handleError);
    }

    update(product: Product) {
        const body = product;
        const headers = new Headers({
            'Content-Type': 'application/json',
            'x-auth-token': AuthorizationService.getCurrentUser().token
        });
        const options = new RequestOptions({headers: headers});
        return this.http.put(environment.PRODUCT_URL, body, options)
            .map((response: Response) => response.status === 200)
            .catch(ProductService.handleError);
    }

    remove(identifier: number): Observable<Boolean> {
        const userToken = AuthorizationService.getCurrentUser().token;
        const headers = new Headers({'x-auth-token': userToken});
        return this.http.delete(environment.PRODUCT_URL + identifier, {headers: headers})
            .map((response) => response.status === 200)
            .catch(ProductService.handleError);
    }

    private static handleError(error: any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText}`;
            errMsg += `${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}