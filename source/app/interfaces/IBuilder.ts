import type { Router } from "express";

export interface IBuilder {
  readonly router: Router;
}
