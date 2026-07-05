import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () =>
      import("./features/grid/grid").then((c) => c.Grid),
  },
  {
    path: "edit",
    loadComponent: () =>
      import("./features/edit-button-dialog/edit-button-dialog").then(
        (c) => c.EditButtonDialog,
      ),
  },
  {
    path: "create",
    loadComponent: () =>
      import("./features/create-button-dialog/create-button-dialog").then(
        (c) => c.CreateButtonDialog,
      ),
  },
];
