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
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./regions.js";
let Province = class Province {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Province.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], Province.prototype, "nom", void 0);
__decorate([
    OneToMany(() => Region, (region) => region.province),
    __metadata("design:type", Array)
], Province.prototype, "regions", void 0);
Province = __decorate([
    Entity()
], Province);
export { Province };
//# sourceMappingURL=provinces.js.map