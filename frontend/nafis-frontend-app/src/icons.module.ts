import { NgModule } from '@angular/core';
import {
  LucideAngularModule,
  Bell,
  Menu,
  Activity,
  Thermometer,
  Heart,
  Save,
  AlertCircle,
  X,
  Home,
  Info,
  Package,
  Phone,
  DollarSign,
  LayoutDashboard,
  ChartNoAxesCombined,
  Calendar,
  Settings2,
  Users,
  BriefcaseMedical,
  ArrowRight,
  LayoutGrid,
  UserRoundSearch,
  Hospital,
  FileChartColumnIncreasing,
  Contact,
  Moon,
  Sun,
  LogOut,
  Ambulance,
  Send,
} from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      Bell,
      Menu,
      Activity,
      Thermometer,
      Heart,
      Save,
      AlertCircle,
      X,
      Home,
      Info,
      Package,
      Phone,
      DollarSign,
      LayoutDashboard,
      ChartNoAxesCombined,
      Calendar,
      Settings2,
      Users,
      BriefcaseMedical,
      ArrowRight,
      LayoutGrid,
      UserRoundSearch,
      Hospital,
      FileChartColumnIncreasing,
      Contact,
      Moon,
      Sun,
      LogOut,
      Ambulance,
      Send,
    }),
  ],
  exports: [
    LucideAngularModule, // Exporte le module pour qu'il soit utilisable ailleurs
  ],
})
export class IconsModule {}
