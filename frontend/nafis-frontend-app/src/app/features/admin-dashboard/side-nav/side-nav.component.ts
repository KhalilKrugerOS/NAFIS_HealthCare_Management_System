import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { IconsModule } from '../../../../icons.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [IconsModule, LucideAngularModule, RouterLink],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent {
  toggleSideNav() {
    document.querySelector('.sidebar')!.classList.toggle('close');
  }
  toggleDarkMode() {
    document.body.classList.toggle('dark');
    document.querySelector('.switch')!.classList.toggle('dark');
  }
}
