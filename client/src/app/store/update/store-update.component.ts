import {Component} from "@angular/core";
import {Store} from "../../model/store";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../common/common.service";
import {Stock} from "../../model/stock";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../constants/environment";
@Component({
    selector: 'store-update-component',
    templateUrl: './store-update.component.html'
})
export class StoreUpdateComponent{
    storeForm: FormGroup;
    loading: boolean = false;
    store: Store;
    availableStocks: Stock[] = [];
    selectedStocks: Stock[] = [];

    constructor(private storeService: CommonService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.storeService.loadAll(environment.STOCK_URL)
            .subscribe(stockList => {
                this.availableStocks = stockList;
                this.createEmptyForm();
                this.fillForm();
            });
        }

    private createEmptyForm(): void {
        this.storeForm = new FormGroup({
            name: new FormControl('', Validators.required),
        });
    }

    private fillForm(): void {
        this.storeService.loadById(environment.STORE_URL, this.route.snapshot.params['id'])
            .subscribe(store => {
                this.store = store;
                this.selectedStocks = this.store.stockList;
                this.cleanAvailableStocks();
                this.storeForm.setValue({
                    name: this.store.name
                });
            });
    }

    private cleanAvailableStocks(): void {
        console.log("available: " + this.availableStocks.length);
        console.log("selected: " + this.selectedStocks.length);
        for (let availableStock = 0; availableStock < this.availableStocks.length; availableStock++)
            for (let selectedStock = 0; selectedStock < this.selectedStocks.length; selectedStock++)
                if (this.availableStocks[availableStock].id === this.selectedStocks[selectedStock].id)
                    this.availableStocks.splice(this.availableStocks.indexOf(this.availableStocks[availableStock]), 1);
    }

    onSubmit(): void {
        this.loading = true;
        this.store.name = this.storeForm.value.name;
        this.store.stockList = this.selectedStocks;
        this.storeService.update(environment.STORE_URL, this.store)
            .subscribe(result => result ? this.router.navigate(['store/store-content']) : this.errorMsg);
    }

    addStockToSelected(stock: Stock): void {
        this.availableStocks.splice(this.availableStocks.indexOf(stock), 1);
        this.selectedStocks.push(stock);
    }

    deleteStockFromSelected(stock: Stock): void {
        this.selectedStocks.splice(this.selectedStocks.indexOf(stock), 1);
        this.availableStocks.push(stock);
    }

    private errorMsg(): void {
        this.loading = false;
        alert("Error!");
    }
}