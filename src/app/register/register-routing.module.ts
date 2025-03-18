import { RouterModule, Routes } from "@angular/router"
import { RegisterPage } from "./register.page"
import { NgModule } from "@angular/core"

const routes: Routes = [
    {
        path: '',
        component: RegisterPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RegisterRoutingModule { }