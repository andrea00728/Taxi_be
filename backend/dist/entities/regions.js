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
import { Province } from "./provinces.js";
import { District } from "./districts.js";
let Region = class Region {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Region.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Region.prototype, "nom", void 0);
__decorate([
    ManyToOne(() => Province, (province) => province.regions, { onDelete: "CASCADE" }),
    JoinColumn({ name: "province_id" }),
    __metadata("design:type", Province)
], Region.prototype, "province", void 0);
__decorate([
    OneToMany(() => District, (district) => district.region),
    __metadata("design:type", Array)
], Region.prototype, "districts", void 0);
Region = __decorate([
    Entity()
], Region);
export { Region };
//# sourceMappingURL=regions.js.map