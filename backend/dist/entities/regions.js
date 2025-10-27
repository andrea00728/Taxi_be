"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Region = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const provinces_js_1 = require("./provinces.js");
const districts_js_1 = require("./districts.js");
let Region = class Region {
};
exports.Region = Region;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Region.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Region.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => provinces_js_1.Province, (province) => province.regions, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "province_id" }),
    __metadata("design:type", provinces_js_1.Province)
], Region.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => districts_js_1.District, (district) => district.region),
    __metadata("design:type", Array)
], Region.prototype, "districts", void 0);
exports.Region = Region = __decorate([
    (0, typeorm_1.Entity)()
], Region);
//# sourceMappingURL=regions.js.map