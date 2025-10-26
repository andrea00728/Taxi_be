var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Ligne } from "./Ligne.js"; // juste pour TypeScript
import { District } from "./districts.js";
let Arret = class Arret {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Arret.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Arret.prototype, "nom", void 0);
__decorate([
    Column("decimal", { precision: 10, scale: 6 }),
    __metadata("design:type", Number)
], Arret.prototype, "latitude", void 0);
__decorate([
    Column("decimal", { precision: 10, scale: 6 }),
    __metadata("design:type", Number)
], Arret.prototype, "longitude", void 0);
__decorate([
    ManyToOne('Ligne', 'arrets'),
    __metadata("design:type", Ligne)
], Arret.prototype, "ligne", void 0);
__decorate([
    ManyToOne('District', 'arrets'),
    __metadata("design:type", District)
], Arret.prototype, "districts", void 0);
Arret = __decorate([
    Entity()
], Arret);
export { Arret };
//# sourceMappingURL=Arret.js.map