var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./regions.js";
import { Ligne } from "./Ligne.js";
let District = class District {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], District.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], District.prototype, "nom", void 0);
__decorate([
    ManyToOne(() => Region, (region) => region.districts, { onDelete: "CASCADE" }),
    JoinColumn({ name: "region_id" }),
    __metadata("design:type", Region)
], District.prototype, "region", void 0);
__decorate([
    OneToMany(() => Ligne, (ligne) => ligne.district),
    __metadata("design:type", Array)
], District.prototype, "lignes", void 0);
__decorate([
    OneToMany('Arret', 'districts'),
    __metadata("design:type", Array)
], District.prototype, "arrets", void 0);
District = __decorate([
    Entity()
], District);
export { District };
//# sourceMappingURL=districts.js.map