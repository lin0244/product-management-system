import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../model/user";
import {Authority} from "../../model/authority";
import {CommonService} from "../../common/common.service";
import {api} from "../../constants/api";
@Component({
    selector: 'user-create-component',
    templateUrl: 'user-create.component.html'
})
export class UserCreateComponent {
    userForm: FormGroup;
    availableAuthorities: Authority[];
    selectedAuthorities: Authority[];
    loading;

    constructor(private userService: CommonService, private router: Router) {
        this.availableAuthorities = [];
        this.selectedAuthorities = [];
        this.loading = false;
    }

    ngOnInit(): void {
        this.loadAuthorities();
        this.createEmptyForm();
    }

    private loadAuthorities(): void {
        this.userService.loadAll(api.AUTHORITY)
            .subscribe(
                availableAuthorities => this.availableAuthorities = availableAuthorities,
                error => this.logError(error));
    }

    private createEmptyForm(): void {
        this.userForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    onSubmit(): void {
        this.loading = true;
        let user: User = new User(this.userForm.value.username, this.userForm.value.password);
        user.authorities = this.selectedAuthorities;
        this.userService.create(api.USER, user)
            .subscribe(
                () => this.router.navigate(['/']).then(() => this.router.navigate(['user'])),
                err => this.logError(err));
    }

    addAuthorityToSelected(authority: Authority): void {
        this.availableAuthorities.splice(this.availableAuthorities.indexOf(authority), 1);
        this.selectedAuthorities.push(authority);
    }

    deleteAuthorityFromSelected(authority: Authority): void {
        this.selectedAuthorities.splice(this.selectedAuthorities.indexOf(authority), 1);
        this.availableAuthorities.push(authority);
    }

    logError(error: Error): void {
        this.loading = false;
        console.error('There was an error: ' + error.message ? error.message : error.toString());
        this.router.navigate(['/']);
    }
}