import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  NbComponentStatus,
  NbMenuService,
  NbSidebarService,
  NbToastrService
} from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import {
  filter,
  takeUntil
} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../pages/home/models/user.model';
import { StorageService } from '../../../storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject<void>();
  user: User

  currentTheme = 'default';

  userMenu = [
    { title: 'Acessar Loja Virtual' },
    { title: 'Sair' }
  ];

  menuWithoutUser = [
    {
      title: 'Login',
      link: 'auth/login',
      icon: 'person-outline',
    }
  ];

  constructor(
    private readonly sidebarService: NbSidebarService,
    private readonly menuService: NbMenuService,
    private readonly layoutService: LayoutService,
    private readonly userAuthService: AuthService,
    private readonly localStorageService: StorageService,
    private readonly toastrService: NbToastrService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    let tokenFromECommerce = this.route.snapshot.queryParams['token'];
    if(tokenFromECommerce){
      this.localStorageService.set('auth_app_token', {value: tokenFromECommerce});
      const urlObj = new URL(window.location.href);
      urlObj.searchParams.delete('token');
      window.location.href = urlObj.toString();
    }

    if(this.localStorageService.get('auth_app_token') != null){
      this.userAuthService.getUserAuthenticated()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.localStorageService.set('auth_user', user)
          this.user = user;
        },
        error: (error) => {
          this.localStorageService.clear()
          this.router.navigate(['auth/login']);
        }
      });
    }else{
      this.localStorageService.clear();
    }

    this.menuService.onItemClick()
    .pipe(
      filter(({ tag }) => tag === 'userMenu'),
      takeUntil(this.destroy$),
    )
    .subscribe((menu: any) => {
      if(menu.item.title == 'Sair'){
        this.userAuthService.doLogout()
      }

      if(menu.item.title == 'Acessar Loja Virtual'){
        let token = this.localStorageService.get('auth_app_token');
        window.location.href = `${environment.baseECommerceUrl}`+'?token='+`${token.value}`;
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  showMessage(status: NbComponentStatus, title: string, message: string) {
    this.toastrService.show(message, title, { status });
  }
}
