import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { LoginService } from './services/login.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'visiontechfront';
  isAuthenticated = false;
  private authSubscription: Subscription = new Subscription();

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    // Suscribirse al estado de autenticación reactivo
    this.authSubscription = this.loginService.isAuthenticated$.subscribe(
      (isAuth: boolean) => {
        this.isAuthenticated = isAuth;
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
